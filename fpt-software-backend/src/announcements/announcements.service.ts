import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto, AnnouncementListResponseDto } from './dto/announcement-response.dto';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadBaseService } from '../common/base/file-upload-base.service';

@Injectable()
export class AnnouncementsService extends FileUploadBaseService<
  Announcement,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementResponseDto,
  AnnouncementListResponseDto
> {
  constructor(
    @InjectRepository(Announcement)
    announcementRepository: Repository<Announcement>,
    fileUploadService: FileUploadService,
  ) {
    super(announcementRepository, AnnouncementsService.name, fileUploadService);
  }

  /**
   * Create a new announcement with file upload support
   */
  async create(createDto: CreateAnnouncementDto, file?: any): Promise<AnnouncementResponseDto> {
    this.logger.log(`Creating announcement: ${createDto.title}`);
    
    try {
      // Handle file upload if provided
      const imageUrl = await this.handleFileUpload(file, createDto.imageUrl);

      // Create announcement with publishedAt logic
      const announcementData = {
        ...createDto,
        imageUrl,
        publishedAt: createDto.isPublished ? new Date() : undefined,
      };

      const entity = this.repository.create(announcementData as any);
      const savedEntity = await this.repository.save(entity) as unknown as Announcement;
      this.logger.log(`Announcement created successfully: ${savedEntity.title}`);

      return this.mapToResponseDto(savedEntity);
    } catch (error) {
      this.logger.error(`Error creating announcement ${createDto.title}:`, error);
      throw error;
    }
  }


  /**
   * Get all announcements (including unpublished) for admin
   */
  async findAllForAdmin(page: number = 1, limit: number = 10, search?: string): Promise<AnnouncementListResponseDto> {
    this.logger.log(`Fetching all announcements for admin - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const queryBuilder = this.repository.createQueryBuilder('entity');
      
      if (search && search.trim()) {
        this.applySearchFilter(queryBuilder, search.trim());
      }
      
      const [announcements, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('entity.createdAt', 'DESC')
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
   * Update an announcement with file upload support
   */
  async update(id: number, updateDto: UpdateAnnouncementDto, file?: any): Promise<AnnouncementResponseDto> {
    this.logger.log(`Updating announcement: ${id}`);
    
    try {
      const announcement = await this.repository.findOne({
        where: { id } as any
      });

      if (!announcement) {
        throw new Error(`Announcement with ID ${id} not found`);
      }

      // Handle file upload if provided
      const imageUrl = await this.handleFileUpload(file, updateDto.imageUrl || announcement.imageUrl || undefined);

      // Update announcement with publishedAt logic
      Object.assign(announcement, {
        ...updateDto,
        imageUrl: imageUrl || announcement.imageUrl,
        publishedAt: updateDto.isPublished && !announcement.publishedAt ? new Date() : announcement.publishedAt,
      });

      const savedEntity = await this.repository.save(announcement) as unknown as Announcement;
      this.logger.log(`Announcement updated successfully: ${savedEntity.title}`);

      return this.mapToResponseDto(savedEntity);
    } catch (error) {
      this.logger.error(`Error updating announcement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Map entity to response DTO
   */
  protected mapToResponseDto(announcement: Announcement): AnnouncementResponseDto {
    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      summary: announcement.summary,
      author: announcement.author,
      category: announcement.category,
      priority: announcement.priority,
      isPublished: announcement.isPublished,
      publishedAt: announcement.publishedAt || undefined,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      tags: announcement.tags || undefined,
      imageUrl: announcement.imageUrl || undefined,
      readTime: announcement.readTime,
    };
  }


  /**
   * Override base service findAll method with comprehensive search and filter
   */
  override async findAll(page: number = 1, limit: number = 10, search?: string): Promise<AnnouncementListResponseDto> {
    this.logger.log(`Fetching announcements with base signature - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const whereClause: any = {};
      
      // Apply search filter (searches in title, content, summary, author)
      if (search && search.trim()) {
        whereClause.title = Like(`%${search.trim()}%`);
      }
      
      const [announcements, total] = await this.repository.findAndCount({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
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
   * Get all announcements with comprehensive search and filter (extended version)
   */
  async findAllWithFilters(
    page: number = 1, 
    limit: number = 10, 
    search?: string,
    category?: string,
    priority?: string,
    status?: string,
    author?: string
  ): Promise<AnnouncementListResponseDto> {
    this.logger.log(`Fetching announcements with filters - page: ${page}, limit: ${limit}, search: ${search || 'none'}, category: ${category || 'none'}, priority: ${priority || 'none'}, status: ${status || 'none'}, author: ${author || 'none'}`);
    
    try {
      const queryBuilder = this.repository.createQueryBuilder('announcement');
      
      // Apply search filter (searches in title, content, summary, author)
      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        queryBuilder.andWhere(
          '(announcement.title LIKE :search OR announcement.content LIKE :search OR announcement.summary LIKE :search OR announcement.author LIKE :search)',
          { search: searchTerm }
        );
      }
      
      // Apply category filter
      if (category && category.trim()) {
        queryBuilder.andWhere('announcement.category LIKE :category', { 
          category: `%${category.trim()}%` 
        });
      }
      
      // Apply priority filter
      if (priority && priority.trim()) {
        const priorityValue = priority.trim().toLowerCase();
        if (['low', 'medium', 'high'].includes(priorityValue)) {
          queryBuilder.andWhere('announcement.priority = :priority', { priority: priorityValue });
        }
      }
      
      // Apply status filter (published/unpublished)
      if (status && status.trim()) {
        const statusValue = status.trim().toLowerCase();
        if (statusValue === 'published' || statusValue === 'true') {
          queryBuilder.andWhere('announcement.isPublished = :isPublished', { isPublished: true });
        } else if (statusValue === 'unpublished' || statusValue === 'false') {
          queryBuilder.andWhere('announcement.isPublished = :isPublished', { isPublished: false });
        }
      }
      
      // Apply author filter
      if (author && author.trim()) {
        queryBuilder.andWhere('announcement.author LIKE :author', { 
          author: `%${author.trim()}%` 
        });
      }
      
      // Apply ordering and pagination
      queryBuilder
        .orderBy('announcement.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);
      
      const [announcements, total] = await queryBuilder.getManyAndCount();
      
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
   * Get filter options for announcements
   */
  async getFilterOptions(): Promise<{
    categories: string[];
    priorities: string[];
    statuses: string[];
    authors: string[];
  }> {
    this.logger.log('Fetching filter options for announcements');
    
    try {
      // Get unique categories
      const categoryResults = await this.repository
        .createQueryBuilder('announcement')
        .select('DISTINCT announcement.category', 'category')
        .where('announcement.category IS NOT NULL')
        .andWhere('announcement.category != :empty', { empty: '' })
        .getRawMany();
      
      // Get unique authors
      const authorResults = await this.repository
        .createQueryBuilder('announcement')
        .select('DISTINCT announcement.author', 'author')
        .where('announcement.author IS NOT NULL')
        .andWhere('announcement.author != :empty', { empty: '' })
        .getRawMany();
      
      return {
        categories: categoryResults.map(r => r.category).filter(Boolean),
        priorities: ['low', 'medium', 'high'],
        statuses: ['published', 'unpublished'],
        authors: authorResults.map(r => r.author).filter(Boolean),
      };
    } catch (error) {
      this.logger.error('Error fetching filter options:', error);
      throw error;
    }
  }

  /**
   * Apply search filter to query builder (required by base service)
   * Fixed: Use LIKE instead of ILIKE for MySQL compatibility and search multiple fields
   */
  protected applySearchFilter(queryBuilder: any, search: string): void {
    queryBuilder.where(
      'announcement.title LIKE :search OR announcement.content LIKE :search OR announcement.summary LIKE :search OR announcement.author LIKE :search',
      { search: `%${search}%` }
    );
  }

  /**
   * Perform cleanup before deletion
   */
  protected async performCleanup(announcement: Announcement): Promise<void> {
    if (announcement.imageUrl) {
      await this.deleteFileIfExists(announcement.imageUrl);
    }
  }
}
