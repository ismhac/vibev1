export class UserResponseDto {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserListResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
