import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
};

const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should pass department filter to service', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);
      await controller.findAll('Software');
      expect(mockUsersService.findAll).toHaveBeenCalledWith('Software', undefined);
    });

    it('should pass role filter to service', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);
      await controller.findAll(undefined, 'Admin');
      expect(mockUsersService.findAll).toHaveBeenCalledWith(undefined, 'Admin');
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('uuid-1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto = {
        name: 'Jane Doe',
        email: 'jane@company.com',
        password: 'Test@1234',
        designation: 'Designer',
        department: 'Design' as any,
        phone: '8888888888',
      };
      mockUsersService.create.mockResolvedValue({ ...mockUser, email: dto.email });
      const result = await controller.create(dto);
      expect(result.email).toBe(dto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const dto = { role: 'Admin' as any };
      mockUsersService.update.mockResolvedValue({ ...mockUser, role: 'Admin' });
      const result = await controller.update('uuid-1', dto);
      expect(result.role).toBe('Admin');
      expect(mockUsersService.update).toHaveBeenCalledWith('uuid-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete user and return message', async () => {
      mockUsersService.remove.mockResolvedValue({ message: 'User uuid-1 deleted successfully' });
      const result = await controller.remove('uuid-1');
      expect(result).toEqual({ message: 'User uuid-1 deleted successfully' });
      expect(mockUsersService.remove).toHaveBeenCalledWith('uuid-1');
    });
  });
});
