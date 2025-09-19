import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto, UserListResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${createUserDto.email}`);
    
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      // Create user
      const user = this.userRepository.create({
        email: createUserDto.email,
        passwordHash: hashedPassword,
        fullName: createUserDto.fullName,
        role: createUserDto.role as any,
        isActive: createUserDto.isActive ?? true,
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created successfully: ${savedUser.email}`);

      return this.mapToResponseDto(savedUser);
    } catch (error) {
      this.logger.error(`Error creating user ${createUserDto.email}:`, error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<UserListResponseDto> {
    this.logger.log(`Fetching users - page: ${page}, limit: ${limit}`);
    
    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      const userDtos = users.map(user => this.mapToResponseDto(user));

      return {
        data: userDtos,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<UserResponseDto> {
    this.logger.log(`Fetching user: ${id}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.mapToResponseDto(user);
    } catch (error) {
      this.logger.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if email is being changed and if it already exists
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email }
        });

        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Hash password if provided
      if (updateUserDto.password) {
        const saltRounds = 10;
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
      }

      // Update user
      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.password) user.passwordHash = updateUserDto.password;
      if (updateUserDto.fullName) user.fullName = updateUserDto.fullName;
      if (updateUserDto.role) user.role = updateUserDto.role as any;
      if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User updated successfully: ${savedUser.email}`);

      return this.mapToResponseDto(savedUser);
    } catch (error) {
      this.logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting user: ${id}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.userRepository.remove(user);
      this.logger.log(`User deleted successfully: ${user.email}`);
    } catch (error) {
      this.logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
