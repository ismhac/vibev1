import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { FileUploadService } from './services/file-upload.service';
import { Announcement } from './entities/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    MulterModule.register({
      dest: './uploads/announcements',
    }),
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, FileUploadService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
