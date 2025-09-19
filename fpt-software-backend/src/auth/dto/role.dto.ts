import { IsString, IsEnum, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { RoleName } from '../enums/role.enum';

export class CreateRoleDto {
  @IsEnum(RoleName, { message: 'Role name must be one of: admin, editor, viewer' })
  name: RoleName;

  @IsString()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateRoleDto {
  @IsEnum(RoleName, { message: 'Role name must be one of: admin, editor, viewer' })
  @IsOptional()
  name?: RoleName;

  @IsString()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class RoleResponseDto {
  id: number;
  name: RoleName;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
