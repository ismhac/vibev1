import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { BaseEntity, BaseResponseDto, PaginatedResponseDto } from '../interfaces/common.interface';

export interface FileUploadService {
  uploadFile(file: any): Promise<{ success: boolean; data?: { fileUrl: string }; error?: string }>;
  deleteFile(filePath: string): Promise<boolean>;
}

export abstract class FileUploadBaseService<
  TEntity extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TResponseDto extends BaseResponseDto,
  TListResponseDto extends PaginatedResponseDto<TResponseDto>
> extends BaseService<TEntity, TCreateDto, TUpdateDto, TResponseDto, TListResponseDto> {
  
  constructor(
    repository: Repository<TEntity>,
    serviceName: string,
    protected readonly fileUploadService: FileUploadService,
  ) {
    super(repository, serviceName);
  }

  /**
   * Handle file upload if provided
   */
  protected async handleFileUpload(file: any, existingImageUrl?: string): Promise<string | undefined> {
    if (!file) {
      return existingImageUrl;
    }

    const uploadResult = await this.fileUploadService.uploadFile(file);
    if (uploadResult.success && uploadResult.data) {
      return uploadResult.data.fileUrl;
    } else {
      throw new ConflictException(`File upload failed: ${uploadResult.error}`);
    }
  }

  /**
   * Delete file if it exists and is a local upload
   */
  protected async deleteFileIfExists(imageUrl: string): Promise<void> {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const filePath = imageUrl.replace('/uploads/', 'uploads/');
      await this.fileUploadService.deleteFile(filePath);
    }
  }
}
