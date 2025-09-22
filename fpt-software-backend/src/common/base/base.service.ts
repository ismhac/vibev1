import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseResponseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  search?: string;
}

export abstract class BaseService<
  TEntity extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TResponseDto extends BaseResponseDto,
  TListResponseDto extends PaginatedResponseDto<TResponseDto>
> {
  protected readonly logger: Logger;

  constructor(
    protected readonly repository: Repository<TEntity>,
    serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
  }

  /**
   * Create a new entity
   */
  async create(createDto: TCreateDto): Promise<TResponseDto> {
    this.logger.log(`Creating entity`);
    
    try {
      // Check for uniqueness constraints if needed
      await this.validateCreateConstraints(createDto);

      // Create entity
      const entity = this.repository.create(createDto as any);
      const savedEntity = await this.repository.save(entity) as unknown as TEntity;
      this.logger.log(`Entity created successfully with ID: ${savedEntity.id}`);

      return this.mapToResponseDto(savedEntity);
    } catch (error) {
      this.logger.error(`Error creating entity:`, error);
      throw error;
    }
  }

  /**
   * Get all entities with pagination support
   */
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<TListResponseDto> {
    this.logger.log(`Fetching entities - page: ${page}, limit: ${limit}, search: ${search || 'none'}`);
    
    try {
      const queryBuilder = this.repository.createQueryBuilder('entity');
      
      // Apply search filter if provided
      if (search && search.trim()) {
        this.applySearchFilter(queryBuilder, search.trim());
      }
      
      // Apply ordering
      this.applyDefaultOrdering(queryBuilder);
      
      const [entities, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const entityDtos = entities.map(entity => this.mapToResponseDto(entity));

      return {
        data: entityDtos,
        total,
        page,
        limit,
      } as TListResponseDto;
    } catch (error) {
      this.logger.error('Error fetching entities:', error);
      throw error;
    }
  }

  /**
   * Get a single entity by ID
   */
  async findOne(id: number): Promise<TResponseDto> {
    this.logger.log(`Fetching entity: ${id}`);
    
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<TEntity>
      });

      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }

      return this.mapToResponseDto(entity);
    } catch (error) {
      this.logger.error(`Error fetching entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update an entity
   */
  async update(id: number, updateDto: TUpdateDto): Promise<TResponseDto> {
    this.logger.log(`Updating entity: ${id}`);
    
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<TEntity>
      });

      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }

      // Validate update constraints if needed
      await this.validateUpdateConstraints(id, updateDto, entity);

      // Update entity
      Object.assign(entity, updateDto);
      const savedEntity = await this.repository.save(entity);
      this.logger.log(`Entity updated successfully: ${savedEntity.id}`);

      return this.mapToResponseDto(savedEntity);
    } catch (error) {
      this.logger.error(`Error updating entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an entity
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting entity: ${id}`);
    
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<TEntity>
      });

      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }

      // Perform cleanup if needed
      await this.performCleanup(entity);

      await this.repository.remove(entity);
      this.logger.log(`Entity deleted successfully: ${entity.id}`);
    } catch (error) {
      this.logger.error(`Error deleting entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Map entity to response DTO
   */
  protected abstract mapToResponseDto(entity: TEntity): TResponseDto;

  /**
   * Apply search filter to query builder
   */
  protected abstract applySearchFilter(queryBuilder: any, search: string): void;

  /**
   * Apply default ordering to query builder
   */
  protected applyDefaultOrdering(queryBuilder: any): void {
    queryBuilder.orderBy('entity.createdAt', 'DESC');
  }

  /**
   * Validate create constraints (override in child classes)
   */
  protected async validateCreateConstraints(createDto: TCreateDto): Promise<void> {
    // Override in child classes if needed
  }

  /**
   * Validate update constraints (override in child classes)
   */
  protected async validateUpdateConstraints(
    id: number, 
    updateDto: TUpdateDto, 
    existingEntity: TEntity
  ): Promise<void> {
    // Override in child classes if needed
  }

  /**
   * Perform cleanup before deletion (override in child classes)
   */
  protected async performCleanup(entity: TEntity): Promise<void> {
    // Override in child classes if needed
  }
}
