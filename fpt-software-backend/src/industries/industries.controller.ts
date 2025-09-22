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
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto, IndustryListResponseDto } from './dto/industry-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  /**
   * Create a new industry
   * @param createIndustryDto - Industry creation data
   * @returns Created industry information
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIndustryDto: CreateIndustryDto): Promise<IndustryResponseDto> {
    return this.industriesService.create(createIndustryDto);
  }

  /**
   * Get all industries with pagination
   * @param page - Page number (optional, default: 1)
   * @param limit - Number of items per page (optional, default: 10)
   * @param search - Search term (optional)
   * @returns Paginated list of industries
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<IndustryListResponseDto> {
    return this.industriesService.findAll(page, limit, search);
  }

  /**
   * Get a single industry by ID
   * @param id - Industry ID
   * @returns Industry details
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IndustryResponseDto> {
    return this.industriesService.findOne(id);
  }

  /**
   * Update an industry
   * @param id - Industry ID
   * @param updateIndustryDto - Industry update data
   * @returns Updated industry information
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ): Promise<IndustryResponseDto> {
    return this.industriesService.update(id, updateIndustryDto);
  }

  /**
   * Delete an industry
   * @param id - Industry ID
   * @returns Success message
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.industriesService.remove(id);
  }
}
