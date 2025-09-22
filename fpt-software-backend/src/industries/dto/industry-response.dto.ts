import { BaseResponseDto, PaginatedResponseDto } from '../../common/interfaces/common.interface';

export class IndustryResponseDto implements BaseResponseDto {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class IndustryListResponseDto implements PaginatedResponseDto<IndustryResponseDto> {
  data: IndustryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
