import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { create } from 'domain';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  const mockPrisma = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  it('should create account', async () => {
    mockPrisma.account.create.mockResolvedValue({
      id: 'accountId',
      accountNumber: 'ACC1776151404617',
      userId: 'userId',
    });

    const result = await service.create('userId');

    expect(prisma.account.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  // FIND ALL
  it('should return all accounts for user', async () => {
    mockPrisma.account.findMany.mockResolvedValue([
      { id: '1', userId: 'userId' },
    ]);

    const result = await service.findAll('userId');

    expect(prisma.account.findMany as jest.Mock).toHaveBeenCalledWith({
      where: { userId: 'userId' },
    });

    expect(result.length).toBe(1);
  });

  // FIND ONE - SUCCESS
  it('should return account if valid', async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: '1',
      userId: 'userId',
    });

    const result = await service.findOne('1', 'userId');

    expect(result).toHaveProperty('id');
  });

  // FIND ONE - NOT FOUND
  it('should throw if account not found', async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    await expect(service.findOne('1', 'userId')).rejects.toThrow(
      NotFoundException,
    );
  });

  // FIND ONE - FORBIDDEN
  it('should throw if account not owned by user', async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: '1',
      userId: 'user2',
    });

    await expect(service.findOne('1', 'userId')).rejects.toThrow(
      ForbiddenException,
    );
  });

  // UPDATE
  it('should update account', async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: '1',
      userId: 'userId',
    });

    mockPrisma.account.update.mockResolvedValue({
      id: '1',
      balance: 1000,
    });

    const result = await service.update('1', 'userId', {
      balance: 1000,
    });

    expect(prisma.account.update as jest.Mock).toHaveBeenCalled();
    expect(result.balance).toBe(1000);
  });

  // REMOVE
  it('should delete account', async () => {
    mockPrisma.account.findUnique.mockResolvedValue({
      id: '1',
      userId: 'userId',
    });

    mockPrisma.account.delete.mockResolvedValue({});

    const result = await service.remove('1', 'userId');

    expect(prisma.account.delete as jest.Mock).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Account deleted successfully',
    });
  });
});
