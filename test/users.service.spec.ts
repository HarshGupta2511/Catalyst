import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'uuid-1',
  name: 'John Doe',
  email: 'john@company.com',
  designation: 'Engineer',
  department: 'Software',
  role: 'Employee',
  phone: '9999999999',
  isProjectLead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // --- findAll ---
  describe('findAll', () => {
    it('should return all users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should filter by department', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);
      await service.findAll('Software');
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { department: 'Software' } }),
      );
    });

    it('should filter by role', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);
      await service.findAll(undefined, 'Admin');
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: 'Admin' } }),
      );
    });
  });

  // --- findOne ---
  describe('findOne', () => {
    it('should return user if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- create ---
  describe('create', () => {
    const dto = {
      name: 'Jane Doe',
      email: 'jane@company.com',
      password: 'Test@1234',
      designation: 'Designer',
      department: 'Design' as any,
      role: undefined,
      phone: '8888888888',
    };

    it('should create user with hashed password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });

      const result = await service.create(dto);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should hash the password before saving', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await service.create(dto);
      expect(hashSpy).toHaveBeenCalledWith(dto.password, 10);
    });
  });

  // --- update ---
  describe('update', () => {
    it('should update and return user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, role: 'Admin' });

      const result = await service.update('uuid-1', { role: 'Admin' as any });
      expect(result.role).toBe('Admin');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  // --- remove ---
  describe('remove', () => {
    it('should delete user and return message', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('uuid-1');
      expect(result).toEqual({ message: 'User uuid-1 deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});