export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface BaseServiceInterface<
  TEntity extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TResponseDto extends BaseResponseDto,
  TListResponseDto extends PaginatedResponseDto<TResponseDto>
> {
  create(createDto: TCreateDto): Promise<TResponseDto>;
  findAll(page?: number, limit?: number, search?: string): Promise<TListResponseDto>;
  findOne(id: number): Promise<TResponseDto>;
  update(id: number, updateDto: TUpdateDto): Promise<TResponseDto>;
  remove(id: number): Promise<void>;
}
