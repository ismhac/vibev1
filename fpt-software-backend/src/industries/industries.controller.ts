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
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto, IndustryListResponseDto } from './dto/industry-response.dto';

@Controller('api/v1/industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  /**
   * Get filter options for industries
   * @returns Available status options
   */
  @Get('filters')
  async getFilterOptions(): Promise<{ statuses: string[] }> {
    return this.industriesService.getFilterOptions();
  }

  /**
   * Get all industries with pagination, search and status filter
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param search - Search term (searches in name)
   * @param status - Filter by status (active/inactive)
   * @returns List of industries with pagination info
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<IndustryListResponseDto> {
    console.log('Industries Controller received params:', { page, limit, search, status });
    
    // If search is provided, use base service search
    if (search && search.trim()) {
      return this.industriesService.findAll(page, limit, search);
    }
    
    // If status is provided, use status filter
    if (status && status.trim()) {
      return this.industriesService.findAllWithStatus(page, limit, status);
    }
    
    // Default: no filters
    return this.industriesService.findAll(page, limit);
  }

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
   * Get a specific industry by ID
   * @param id - Industry ID
   * @returns Industry information
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
