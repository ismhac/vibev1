export class AnnouncementResponseDto {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  imageUrl?: string;
  readTime?: number;
}

export class AnnouncementListResponseDto {
  data: AnnouncementResponseDto[];
  total: number;
  page: number;
  limit: number;
}
