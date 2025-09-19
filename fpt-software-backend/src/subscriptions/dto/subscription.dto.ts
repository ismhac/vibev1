import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;
}

export class SubscriptionResponseDto {
  message: string;
  timestamp: Date;
}
