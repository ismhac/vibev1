import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto, IndustryListResponseDto } from './dto/industry-response.dto';
import { BaseService } from '../common/base/base.service';

@Injectable()
export class IndustriesService extends BaseService<
  Industry,
  CreateIndustryDto,
  UpdateIndustryDto,
  IndustryResponseDto,
  IndustryListResponseDto
> {
  constructor(
    @InjectRepository(Industry)
    industryRepository: Repository<Industry>,
  ) {
    super(industryRepository, IndustriesService.name);
  }

  /**
   * Map entity to response DTO
   */
  protected mapToResponseDto(industry: Industry): IndustryResponseDto {
    return {
      id: industry.id,
      name: industry.name,
      description: industry.description,
      imageUrl: industry.imageUrl,
      isActive: industry.isActive,
      createdAt: industry.createdAt,
      updatedAt: industry.updatedAt,
    };
  }

  /**
   * Override base service findAll to implement custom search and filter logic
   */
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<IndustryListResponseDto> {
    this.logger.log(`Fetching industries - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const whereClause: any = {};
      
      // Apply search filter if provided
      if (search && search.trim()) {
        whereClause.name = Like(`%${search.trim()}%`);
      }
      
      const [industries, total] = await this.repository.findAndCount({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      
      const industryDtos = industries.map(industry => this.mapToResponseDto(industry));
      
      return {
        data: industryDtos,
        total,
        page,
        limit,
      };
      
    } catch (error) {
      this.logger.error('Error fetching industries:', error);
      throw error;
    }
  }

  /**
   * Get all industries with status filter only
   */
  async findAllWithStatus(page: number = 1, limit: number = 10, status?: string): Promise<IndustryListResponseDto> {
    this.logger.log(`Fetching industries with status filter - page: ${page}, limit: ${limit}, status: ${status || 'all'}`);
    
    try {
      if (status && status.trim()) {
        const statusFilter = status.trim().toLowerCase();
        let isActive: boolean | null = null;
        
        if (statusFilter === 'active' || statusFilter === 'true') {
          isActive = true;
        } else if (statusFilter === 'inactive' || statusFilter === 'false') {
          isActive = false;
        }
        
        if (isActive !== null) {
          const [industries, total] = await this.repository.findAndCount({
            where: { isActive },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
          });
          
          const industryDtos = industries.map(industry => this.mapToResponseDto(industry));
          
          return {
            data: industryDtos,
            total,
            page,
            limit,
          };
        }
      }
      
      // Default: no status filter - call our own method, not base service
      const [industries, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      
      const industryDtos = industries.map(industry => this.mapToResponseDto(industry));
      
      return {
        data: industryDtos,
        total,
        page,
        limit,
      };
      
    } catch (error) {
      this.logger.error('Error fetching industries with status:', error);
      throw error;
    }
  }

  /**
   * Get filter options for industries
   */
  async getFilterOptions(): Promise<{ statuses: string[] }> {
    this.logger.log('Fetching filter options for industries');
    
    try {
      return {
        statuses: ['active', 'inactive']
      };
    } catch (error) {
      this.logger.error('Error fetching filter options:', error);
      throw error;
    }
  }


  /**
   * Validate create constraints
   */
  protected async validateCreateConstraints(createDto: CreateIndustryDto): Promise<void> {
    const existingIndustry = await this.repository.findOne({
      where: { name: createDto.name }
    });

    if (existingIndustry) {
      throw new ConflictException('Industry with this name already exists');
    }
  }

  /**
   * Validate update constraints
   */
  protected async validateUpdateConstraints(
    id: number, 
    updateDto: UpdateIndustryDto, 
    existingEntity: Industry
  ): Promise<void> {
    if (updateDto.name && updateDto.name !== existingEntity.name) {
      const existingIndustry = await this.repository.findOne({
        where: { name: updateDto.name }
      });

      if (existingIndustry) {
        throw new ConflictException('Industry with this name already exists');
      }
    }
  }

  /**
   * Apply search filter to query builder (required by base service)
   * Fixed: Use LIKE instead of ILIKE for MySQL compatibility and only search name
   */
  protected applySearchFilter(queryBuilder: any, search: string): void {
    // Only search by name, use LIKE for MySQL compatibility
    queryBuilder.where('entity.name LIKE :search', { search: `%${search}%` });
  }
}
