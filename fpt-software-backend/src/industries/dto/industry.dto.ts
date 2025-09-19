export class IndustryDto {
  id: number;
  name: string;
  description: string;
  icon: string;
  services: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class IndustryListDto {
  data: IndustryDto[];
  total: number;
  page: number;
  limit: number;
}
