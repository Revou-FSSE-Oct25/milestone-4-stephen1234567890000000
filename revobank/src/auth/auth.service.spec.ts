jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // REGISTER
  it('should register user', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockPrisma.user.create.mockResolvedValue({
      id: 'userId',
      email: 'test@gmail.com',
      password: 'hashedPassword',
      name: 'Stephen',
      role: 'USER',
    });

    const result = await service.register({
      email: 'test@gmail.com',
      password: '123456',
      name: 'Stephen',
    });

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('test@gmail.com');
  });

  // LOGIN SUCCESS
  it('should login user', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'userId',
      email: 'test@gmail.com',
      password: 'hashedPassword',
      role: 'USER',
    });

    const result = await service.login({
      email: 'test@gmail.com',
      password: '123456',
    });

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toHaveProperty('token');
  });

  // LOGIN FAIL - USER NOT FOUND
  it('should throw if user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'wrong@gmail.com',
        password: '123456',
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  // LOGIN FAIL - WRONG PASSWORD
  it('should throw if password invalid', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'userId',
      email: 'test@gmail.com',
      password: 'hashedPassword',
    });

    await expect(
      service.login({
        email: 'test@gmail.com',
        password: 'wrong',
      }),
    ).rejects.toThrow('Invalid credentials');
  });
});
