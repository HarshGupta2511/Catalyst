import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum Department {
  Software = 'Software',
  Design = 'Design',
  Engineering = 'Engineering',
  Procurement = 'Procurement',
  FlightOps = 'Flight Ops',
  Production = 'Production',
  Store = 'Store',
  Finance = 'Finance',
}

export enum Role {
  Employee = 'Employee',
  ProductLead = 'Product Lead',
  DepartmentHead = 'Department Head',
  CEO = 'CEO',
  Admin = 'Admin',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsEnum(Department)
  department: Department;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  phone?: string;
}
