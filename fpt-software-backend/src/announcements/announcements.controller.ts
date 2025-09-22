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
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto, AnnouncementListResponseDto } from './dto/announcement-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  /**
   * Create a new announcement
   * @param createAnnouncementDto - Announcement creation data
   * @param file - Optional uploaded file
   * @returns Created announcement information
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @UploadedFile() file?: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.create(createAnnouncementDto, file);
  }

  /**
   * Get all published announcements with pagination
   * @param page - Page number (optional, default: 1)
   * @param limit - Number of items per page (optional, default: 10)
   * @returns Paginated list of published announcements
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<AnnouncementListResponseDto> {
    return this.announcementsService.findAll(page, limit);
  }

  /**
   * Get all announcements (including unpublished) for admin
   * @param page - Page number (optional, default: 1)
   * @param limit - Number of items per page (optional, default: 10)
   * @param search - Search term (optional)
   * @returns Paginated list of all announcements
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async findAllForAdmin(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<AnnouncementListResponseDto> {
    return this.announcementsService.findAllForAdmin(page, limit, search);
  }

  /**
   * Get a single announcement by ID
   * @param id - Announcement ID
   * @returns Announcement details
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AnnouncementResponseDto> {
    return this.announcementsService.findOne(id);
  }

  /**
   * Update an announcement
   * @param id - Announcement ID
   * @param updateAnnouncementDto - Announcement update data
   * @param file - Optional uploaded file
   * @returns Updated announcement information
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @UploadedFile() file?: any,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.update(id, updateAnnouncementDto, file);
  }

  /**
   * Delete an announcement
   * @param id - Announcement ID
   * @returns Success message
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.announcementsService.remove(id);
  }
}
