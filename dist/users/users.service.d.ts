import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(department?: string, role?: string): Promise<{
        id: string;
        email: string;
        name: string;
        designation: string;
        department: string;
        role: string;
        phone: string | null;
        isProjectLead: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        designation: string;
        department: string;
        role: string;
        phone: string | null;
        isProjectLead: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        designation: string;
        department: string;
        role: string;
        phone: string | null;
        isProjectLead: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        designation: string;
        department: string;
        role: string;
        phone: string | null;
        isProjectLead: boolean;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
