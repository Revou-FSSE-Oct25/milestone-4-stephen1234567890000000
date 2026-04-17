import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  private async getAccount(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async deposit(userId: string, dto) {
    const account = await this.getAccount(userId, dto.accountId);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.account.update({
        where: { id: account.id },
        data: {
          balance: { increment: dto.amount },
        },
      });

      await tx.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: dto.amount,
          receiverId: account.id,
        },
      });

      return updated;
    });
  }

  async withdraw(userId: string, dto) {
    const account = await this.getAccount(userId, dto.accountId);

    if (account.balance < dto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.account.update({
        where: { id: account.id },
        data: {
          balance: { decrement: dto.amount },
        },
      });

      await tx.transaction.create({
        data: {
          type: 'WITHDRAW',
          amount: dto.amount,
          senderId: account.id,
        },
      });

      return updated;
    });
  }

  async transfer(userId: string, dto) {
    const fromAccount = await this.getAccount(userId, dto.fromAccountId);

    const toAccount = await this.prisma.account.findUnique({
      where: { id: dto.toAccountId },
    });

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (fromAccount.balance < dto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromAccount.id },
        data: {
          balance: { decrement: dto.amount },
        },
      });

      await tx.account.update({
        where: { id: toAccount.id },
        data: {
          balance: { increment: dto.amount },
        },
      });

      const trx = await tx.transaction.create({
        data: {
          type: 'TRANSFER',
          amount: dto.amount,
          senderId: fromAccount.id,
          receiverId: toAccount.id,
        },
      });

      return trx;
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { Account_Transaction_senderIdToAccount: { userId } },
          { Account_Transaction_receiverIdToAccount: { userId } },
        ],
      },
      include: {
        Account_Transaction_senderIdToAccount: true,
        Account_Transaction_receiverIdToAccount: true,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        Account_Transaction_senderIdToAccount: true,
        Account_Transaction_receiverIdToAccount: true,
      },
    });

    if (!trx) {
      throw new NotFoundException('Transaction not found');
    }

    const isOwner =
      trx.Account_Transaction_senderIdToAccount?.userId === userId ||
      trx.Account_Transaction_receiverIdToAccount?.userId === userId;

    if (!isOwner) {
      throw new ForbiddenException('Access denied');
    }

    return trx;
  }
}
