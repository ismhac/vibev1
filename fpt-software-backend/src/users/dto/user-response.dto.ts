import { BaseResponseDto, PaginatedResponseDto } from '../../common/interfaces/common.interface';

export class UserResponseDto implements BaseResponseDto {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserListResponseDto implements PaginatedResponseDto<UserResponseDto> {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
