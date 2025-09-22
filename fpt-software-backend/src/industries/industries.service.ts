import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto, IndustryListResponseDto } from './dto/industry-response.dto';

@Injectable()
export class IndustriesService {
  private readonly logger = new Logger(IndustriesService.name);

  constructor(
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
  ) {}

  /**
   * Create a new industry
   * @param createIndustryDto - Industry creation data
   * @returns Created industry information
   */
  async create(createIndustryDto: CreateIndustryDto): Promise<IndustryResponseDto> {
    this.logger.log(`Creating industry: ${createIndustryDto.name}`);
    
    try {
      // Check if industry already exists
      const existingIndustry = await this.industryRepository.findOne({
        where: { name: createIndustryDto.name }
      });

      if (existingIndustry) {
        throw new ConflictException('Industry with this name already exists');
      }

      // Create industry
      const industry = this.industryRepository.create(createIndustryDto);
      const savedIndustry = await this.industryRepository.save(industry);
      this.logger.log(`Industry created successfully: ${savedIndustry.name}`);

      return this.mapToResponseDto(savedIndustry);
    } catch (error) {
      this.logger.error(`Error creating industry ${createIndustryDto.name}:`, error);
      throw error;
    }
  }

  /**
   * Get all industries with pagination support
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param search - Search term (optional)
   * @returns Paginated list of industries
   */
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<IndustryListResponseDto> {
    this.logger.log(`Fetching industries - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const queryBuilder = this.industryRepository.createQueryBuilder('industry');
      
      if (search && search.trim()) {
        queryBuilder.where(
          'industry.name ILIKE :search OR industry.description ILIKE :search',
          { search: `%${search.trim()}%` }
        );
      }
      
      const [industries, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('industry.createdAt', 'DESC')
        .getManyAndCount();

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
   * Get a single industry by ID
   * @param id - Industry ID
   * @returns Industry information
   */
  async findOne(id: number): Promise<IndustryResponseDto> {
    this.logger.log(`Fetching industry: ${id}`);
    
    try {
      const industry = await this.industryRepository.findOne({
        where: { id }
      });

      if (!industry) {
        throw new NotFoundException(`Industry with ID ${id} not found`);
      }

      return this.mapToResponseDto(industry);
    } catch (error) {
      this.logger.error(`Error fetching industry ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update an industry
   * @param id - Industry ID
   * @param updateIndustryDto - Industry update data
   * @returns Updated industry information
   */
  async update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<IndustryResponseDto> {
    this.logger.log(`Updating industry: ${id}`);
    
    try {
      const industry = await this.industryRepository.findOne({
        where: { id }
      });

      if (!industry) {
        throw new NotFoundException(`Industry with ID ${id} not found`);
      }

      // Check if name is being changed and if it already exists
      if (updateIndustryDto.name && updateIndustryDto.name !== industry.name) {
        const existingIndustry = await this.industryRepository.findOne({
          where: { name: updateIndustryDto.name }
        });

        if (existingIndustry) {
          throw new ConflictException('Industry with this name already exists');
        }
      }

      // Update industry
      Object.assign(industry, updateIndustryDto);
      const savedIndustry = await this.industryRepository.save(industry);
      this.logger.log(`Industry updated successfully: ${savedIndustry.name}`);

      return this.mapToResponseDto(savedIndustry);
    } catch (error) {
      this.logger.error(`Error updating industry ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an industry
   * @param id - Industry ID
   * @returns Success message
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting industry: ${id}`);
    
    try {
      const industry = await this.industryRepository.findOne({
        where: { id }
      });

      if (!industry) {
        throw new NotFoundException(`Industry with ID ${id} not found`);
      }

      await this.industryRepository.remove(industry);
      this.logger.log(`Industry deleted successfully: ${industry.name}`);
    } catch (error) {
      this.logger.error(`Error deleting industry ${id}:`, error);
      throw error;
    }
  }

  private mapToResponseDto(industry: Industry): IndustryResponseDto {
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
}
