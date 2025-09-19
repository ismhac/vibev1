import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @IsEnum(['admin', 'editor', 'viewer'], { message: 'Role must be one of: admin, editor, viewer' })
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean = true;
}
