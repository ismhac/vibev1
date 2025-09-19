import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * @param loginDto - Login credentials (email and password)
   * @returns JWT token and user information
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user profile
   * @param req - Request object containing user from JWT
   * @returns Current user information
   */
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: { user: User }) {
    return {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      isActive: req.user.isActive,
      lastLoginAt: req.user.lastLoginAt,
      createdAt: req.user.createdAt,
    };
  }

  /**
   * Validate token endpoint
   * @param req - Request object containing user from JWT
   * @returns Token validation result
   */
  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  async validateToken(@Request() req: { user: User }) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
      },
    };
  }
}
