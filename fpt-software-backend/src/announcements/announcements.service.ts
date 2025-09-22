import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto, AnnouncementListResponseDto } from './dto/announcement-response.dto';
import { FileUploadService } from './services/file-upload.service';

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * Create a new announcement
   * @param createAnnouncementDto - Announcement creation data
   * @param file - Optional uploaded file
   * @returns Created announcement information
   */
  async create(createAnnouncementDto: CreateAnnouncementDto, file?: any): Promise<AnnouncementResponseDto> {
    this.logger.log(`Creating announcement: ${createAnnouncementDto.title}`);
    
    try {
      // Handle file upload if provided
      let imageUrl = createAnnouncementDto.imageUrl;
      if (file) {
        const uploadResult = await this.fileUploadService.uploadFile(file);
        if (uploadResult.success && uploadResult.data) {
          imageUrl = uploadResult.data.fileUrl;
        } else {
          throw new ConflictException(`File upload failed: ${uploadResult.error}`);
        }
      }

      // Create announcement
      const announcementData = {
        ...createAnnouncementDto,
        imageUrl,
        publishedAt: createAnnouncementDto.isPublished ? new Date() : undefined,
      };

      const announcement = this.announcementRepository.create(announcementData);
      const savedAnnouncement = await this.announcementRepository.save(announcement);
      this.logger.log(`Announcement created successfully: ${savedAnnouncement.title}`);

      return this.mapToResponseDto(savedAnnouncement);
    } catch (error) {
      this.logger.error(`Error creating announcement ${createAnnouncementDto.title}:`, error);
      throw error;
    }
  }

  /**
   * Get all published announcements with pagination support
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of published announcements
   */
  async findAll(page: number = 1, limit: number = 10): Promise<AnnouncementListResponseDto> {
    this.logger.log(`Fetching announcements - page: ${page}, limit: ${limit}`);
    
    try {
      const [announcements, total] = await this.announcementRepository.findAndCount({
        where: { isPublished: true },
        skip: (page - 1) * limit,
        take: limit,
        order: { publishedAt: 'DESC' },
      });

      const announcementDtos = announcements.map(announcement => this.mapToResponseDto(announcement));

      return {
        data: announcementDtos,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Error fetching announcements:', error);
      throw error;
    }
  }

  /**
   * Get all announcements (including unpublished) with pagination support
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param search - Search term (optional)
   * @returns Paginated list of all announcements
   */
  async findAllForAdmin(page: number = 1, limit: number = 10, search?: string): Promise<AnnouncementListResponseDto> {
    this.logger.log(`Fetching all announcements for admin - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const queryBuilder = this.announcementRepository.createQueryBuilder('announcement');
      
      if (search && search.trim()) {
        queryBuilder.where(
          'announcement.title ILIKE :search OR announcement.content ILIKE :search OR announcement.summary ILIKE :search OR announcement.author ILIKE :search OR announcement.category ILIKE :search',
          { search: `%${search.trim()}%` }
        );
      }
      
      const [announcements, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('announcement.createdAt', 'DESC')
        .getManyAndCount();

      const announcementDtos = announcements.map(announcement => this.mapToResponseDto(announcement));

      return {
        data: announcementDtos,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Error fetching all announcements:', error);
      throw error;
    }
  }

  /**
   * Get a single announcement by ID
   * @param id - Announcement ID
   * @returns Announcement information
   */
  async findOne(id: number): Promise<AnnouncementResponseDto> {
    this.logger.log(`Fetching announcement: ${id}`);
    
    try {
      const announcement = await this.announcementRepository.findOne({
        where: { id }
      });

      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }

      return this.mapToResponseDto(announcement);
    } catch (error) {
      this.logger.error(`Error fetching announcement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update an announcement
   * @param id - Announcement ID
   * @param updateAnnouncementDto - Announcement update data
   * @param file - Optional uploaded file
   * @returns Updated announcement information
   */
  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto, file?: any): Promise<AnnouncementResponseDto> {
    this.logger.log(`Updating announcement: ${id}`);
    
    try {
      const announcement = await this.announcementRepository.findOne({
        where: { id }
      });

      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }

      // Handle file upload if provided
      let imageUrl = updateAnnouncementDto.imageUrl;
      if (file) {
        const uploadResult = await this.fileUploadService.uploadFile(file);
        if (uploadResult.success && uploadResult.data) {
          imageUrl = uploadResult.data.fileUrl;
        } else {
          throw new ConflictException(`File upload failed: ${uploadResult.error}`);
        }
      }

      // Update announcement
      Object.assign(announcement, {
        ...updateAnnouncementDto,
        imageUrl: imageUrl || announcement.imageUrl,
        publishedAt: updateAnnouncementDto.isPublished && !announcement.publishedAt ? new Date() : announcement.publishedAt,
      });

      const savedAnnouncement = await this.announcementRepository.save(announcement);
      this.logger.log(`Announcement updated successfully: ${savedAnnouncement.title}`);

      return this.mapToResponseDto(savedAnnouncement);
    } catch (error) {
      this.logger.error(`Error updating announcement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an announcement
   * @param id - Announcement ID
   * @returns Success message
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting announcement: ${id}`);
    
    try {
      const announcement = await this.announcementRepository.findOne({
        where: { id }
      });

      if (!announcement) {
        throw new NotFoundException(`Announcement with ID ${id} not found`);
      }

      // Delete associated file if exists
      if (announcement.imageUrl && announcement.imageUrl.startsWith('/uploads/')) {
        const filePath = announcement.imageUrl.replace('/uploads/', 'uploads/');
        await this.fileUploadService.deleteFile(filePath);
      }

      await this.announcementRepository.remove(announcement);
      this.logger.log(`Announcement deleted successfully: ${announcement.title}`);
    } catch (error) {
      this.logger.error(`Error deleting announcement ${id}:`, error);
      throw error;
    }
  }

  private mapToResponseDto(announcement: Announcement): AnnouncementResponseDto {
    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      summary: announcement.summary,
      author: announcement.author,
      category: announcement.category,
      priority: announcement.priority,
      isPublished: announcement.isPublished,
      publishedAt: announcement.publishedAt,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      tags: announcement.tags,
      imageUrl: announcement.imageUrl,
      readTime: announcement.readTime,
    };
  }
}
