import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  const mockPrisma = {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // DEPOSIT
  it('should deposit succesfully', async () => {
    const account = { id: 'acc1', userId: 'user1', balance: 1000 };

    mockPrisma.account.findUnique.mockResolvedValue(account);

    mockPrisma.$transaction.mockImplementation(async (cb) => {
      return cb({
        account: {
          update: jest.fn().mockResolvedValue({
            ...account,
            balance: 2000,
          }),
        },
        transaction: {
          create: jest.fn(),
        },
      });
    });

    const result = await service.deposit('user1', {
      accountId: 'acc1',
      amount: 1000,
    });

    expect(result.balance).toBe(2000);
  });

  // WITHDRAW SUCCESS
  it('should withdraw successfully', async () => {
    const account = { id: 'acc1', userId: 'user1', balance: 2000 };

    mockPrisma.account.findUnique.mockResolvedValue(account);

    mockPrisma.$transaction.mockImplementation(async (cb) => {
      return await cb({
        account: {
          update: jest.fn().mockResolvedValue({ ...account, balance: 1000 }),
        },
        transaction: {
          create: jest.fn(),
        },
      });
    });
    const result = await service.withdraw('user1', {
      accountId: 'acc1',
      amount: 1000,
    });

    expect(result.balance).toBe(1000);
  });

  // WITHDRAW FAIL (INSUFFICIENT)
  it('should fail withdraw if insufficient funds', async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: 'acc1',
      userId: 'user1',
      balance: 500,
    });

    await expect(
      service.withdraw('user1', {
        accountId: 'acc1',
        amount: 1000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  // TRANSFER SUCCESS
  it('should transfer successfully', async () => {
    const from = { id: 'acc1', userId: 'user1', balance: 2000 };
    const to = { id: 'acc2', userId: 'user2', balance: 500 };

    mockPrisma.account.findUnique
      .mockResolvedValueOnce(from) // getAccount
      .mockResolvedValueOnce(to); // destination

    mockPrisma.$transaction.mockImplementation(async (cb) => {
      return await cb({
        account: {
          update: jest
            .fn()
            .mockResolvedValueOnce({ balance: 1000 })
            .mockResolvedValueOnce({ balance: 1500 }),
        },
        transaction: {
          create: jest.fn().mockResolvedValue({
            id: 'trx1',
            amount: 1000,
          }),
        },
      });
    });

    const result = await service.transfer('user1', {
      fromAccountId: 'acc1',
      toAccountId: 'acc2',
      amount: 1000,
    });

    expect(result).toHaveProperty('id');
  });

  // TRANSFER FAIL (DESTINATION NOT FOUND)
  it('should fail if destination not found', async () => {
    mockPrisma.account.findUnique
      .mockResolvedValueOnce({ id: 'acc1', userId: 'user1', balance: 2000 })
      .mockResolvedValueOnce(null);

    await expect(
      service.transfer('user1', {
        fromAccountId: 'acc1',
        toAccountId: 'acc2',
        amount: 1000,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  // FIND ALL
  it('should return transactions', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([{ id: 'trx1' }]);

    const result = await service.findAll('user1');

    expect(result.length).toBe(1);
  });

  // FIND ONE SUCCESS
  it('should return transaction if owner', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'trx1',
      Account_Transaction_senderIdToAccount: { userId: 'user1' },
      Account_Transaction_receiverIdToAccount: null,
    });

    const result = await service.findOne('user1', 'trx1');

    expect(result).toHaveProperty('id');
  });

  // FIND ONE FORBIDDEN
  it('should throw if not owner', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'trx1',
      Account_Transaction_senderIdToAccount: { userId: 'user2' },
      Account_Transaction_receiverIdToAccount: { userId: 'user3' },
    });

    await expect(service.findOne('user1', 'trx1')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
