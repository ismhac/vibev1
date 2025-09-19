import { IsEmail, IsString, IsEnum, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { RoleName } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
  fullName: string;

  @IsEnum(RoleName, { message: 'Role must be one of: admin, editor, viewer' })
  @IsOptional()
  role?: RoleName;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
  @IsOptional()
  fullName?: string;

  @IsEnum(RoleName, { message: 'Role must be one of: admin, editor, viewer' })
  @IsOptional()
  role?: RoleName;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UserResponseDto {
  id: number;
  email: string;
  fullName: string;
  role: RoleName;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
