import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustriesModule } from './industries/industries.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Role } from './auth/entities/role.entity';
import { User } from './auth/entities/user.entity';
import { Industry } from './industries/entities/industry.entity';
import { Announcement } from './announcements/entities/announcement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'fpt_software_user',
      password: process.env.DB_PASSWORD || 'fpt_software_password',
      database: process.env.DB_DATABASE || 'fpt_software_website',
            entities: [Role, User, Industry, Announcement],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
          IndustriesModule,
          AnnouncementsModule,
          SubscriptionsModule,
          AuthModule,
          UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
