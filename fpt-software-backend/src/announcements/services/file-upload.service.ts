import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { FileUploadDto, FileUploadResponseDto } from '../dto/file-upload.dto';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadPath = 'uploads/announcements';
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadPath}`);
    }
  }

  async uploadFile(file: any): Promise<FileUploadResponseDto> {
    try {
      this.logger.log(`Uploading file: ${file.originalname}`);

      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
      const filePath = join(this.uploadPath, fileName);

      // Save file
      const fs = require('fs').promises;
      await fs.writeFile(filePath, file.buffer);

      // Generate file URL
      const fileUrl = `/uploads/announcements/${fileName}`;

      const fileData: FileUploadDto = {
        fieldName: file.fieldname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        filePath: filePath,
        fileUrl: fileUrl,
        tags: this.generateFileTags(file.mimetype),
      };

      this.logger.log(`File uploaded successfully: ${fileUrl}`);

      return {
        success: true,
        message: 'File uploaded successfully',
        data: fileData,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      return {
        success: false,
        message: 'Failed to upload file',
        error: error.message,
      };
    }
  }

  private validateFile(file: any): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
  }

  private generateFileTags(mimeType: string): string[] {
    const tags: string[] = [];
    
    if (mimeType.startsWith('image/')) {
      tags.push('image');
    } else if (mimeType.startsWith('application/pdf')) {
      tags.push('document', 'pdf');
    } else if (mimeType.includes('word')) {
      tags.push('document', 'word');
    } else if (mimeType.startsWith('text/')) {
      tags.push('document', 'text');
    }

    return tags;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fs = require('fs').promises;
      await fs.unlink(filePath);
      this.logger.log(`File deleted successfully: ${filePath}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      return false;
    }
  }
}
