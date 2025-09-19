export class IndustryResponseDto {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class IndustryListResponseDto {
  data: IndustryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
