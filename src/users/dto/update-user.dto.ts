import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Department, Role } from './create-user.dto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsEnum(Department)
  @IsOptional()
  department?: Department;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isProjectLead?: boolean;
}
