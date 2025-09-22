import { BaseResponseDto, PaginatedResponseDto } from '../../common/interfaces/common.interface';

export class AnnouncementResponseDto implements BaseResponseDto {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[] | null;
  imageUrl?: string | null;
  readTime?: number;
}

export class AnnouncementListResponseDto implements PaginatedResponseDto<AnnouncementResponseDto> {
  data: AnnouncementResponseDto[];
  total: number;
  page: number;
  limit: number;
}
