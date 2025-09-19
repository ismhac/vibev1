import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.log(`Validating user: ${email}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { email, isActive: true }
      });

      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        return null;
      }

      this.logger.log(`User validated successfully: ${email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error validating user ${email}:`, error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      this.logger.warn(`Login failed for: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Login successful for: ${loginDto.email}`);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateToken(payload: any): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true }
      });

      if (!user) {
        this.logger.warn(`User not found for token: ${payload.sub}`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating token:`, error);
      return null;
    }
  }
}
