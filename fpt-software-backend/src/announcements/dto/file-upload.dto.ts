import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class FileUploadDto {
  @IsString({ message: 'Field name must be a string' })
  @IsNotEmpty({ message: 'Field name is required' })
  fieldName: string;

  @IsString({ message: 'Original name must be a string' })
  @IsNotEmpty({ message: 'Original name is required' })
  originalName: string;

  @IsString({ message: 'Mime type must be a string' })
  @IsNotEmpty({ message: 'Mime type is required' })
  mimeType: string;

  @IsString({ message: 'File path must be a string' })
  @IsNotEmpty({ message: 'File path is required' })
  filePath: string;

  @IsString({ message: 'File URL must be a string' })
  @IsNotEmpty({ message: 'File URL is required' })
  fileUrl: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}

export class FileUploadResponseDto {
  success: boolean;
  message: string;
  data?: FileUploadDto;
  error?: string;
}
