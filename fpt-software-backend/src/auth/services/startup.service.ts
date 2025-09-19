import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Injectable()
export class StartupService implements OnModuleInit {
  private readonly logger = new Logger(StartupService.name);

  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    this.logger.log('Application starting up...');
    
    try {
      await this.seederService.seed();
      this.logger.log('Startup seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during startup seeding:', error);
      // Don't throw error to prevent app from crashing
    }
  }
}
