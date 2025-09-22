import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
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

export abstract class BaseController<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TResponseDto extends BaseResponseDto,
  TListResponseDto extends PaginatedResponseDto<TResponseDto>
> {
  constructor(protected readonly service: any) {}

  /**
   * Create a new entity
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: TCreateDto): Promise<TResponseDto> {
    return this.service.create(createDto);
  }

  /**
   * Get all entities with pagination
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<TListResponseDto> {
    return this.service.findAll(page, limit, search);
  }

  /**
   * Get a single entity by ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TResponseDto> {
    return this.service.findOne(id);
  }

  /**
   * Update an entity
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: TUpdateDto,
  ): Promise<TResponseDto> {
    return this.service.update(id, updateDto);
  }

  /**
   * Delete an entity
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
