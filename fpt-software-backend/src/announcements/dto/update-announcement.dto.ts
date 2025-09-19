import { IsOptional, IsString, MinLength, MaxLength, IsBoolean, IsUrl, IsEnum, IsArray, IsInt, Min, Max } from 'class-validator';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'Summary must be a string' })
  @MaxLength(500, { message: 'Summary must not exceed 500 characters' })
  summary?: string;

  @IsOptional()
  @IsString({ message: 'Author must be a string' })
  @MaxLength(255, { message: 'Author must not exceed 255 characters' })
  author?: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(100, { message: 'Category must not exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished?: boolean;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsInt({ message: 'Read time must be an integer' })
  @Min(1, { message: 'Read time must be at least 1 minute' })
  @Max(120, { message: 'Read time must not exceed 120 minutes' })
  readTime?: number;
}
