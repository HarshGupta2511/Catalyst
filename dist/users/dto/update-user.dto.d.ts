import { Department, Role } from './create-user.dto';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    designation?: string;
    department?: Department;
    role?: Role;
    phone?: string;
    isProjectLead?: boolean;
}
