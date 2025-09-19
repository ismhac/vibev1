import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { SeederService } from './services/seeder.service';
import { StartupService } from './services/startup.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TestAuthController } from './controllers/test-auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController, TestAuthController],
  providers: [SeederService, StartupService, AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [SeederService, AuthService, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
