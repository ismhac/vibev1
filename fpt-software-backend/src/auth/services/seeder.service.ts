import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { RoleName } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');
    
    try {
      await this.seedRoles();
      await this.seedUsers();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
      throw error;
    }
  }

  private async seedRoles(): Promise<void> {
    this.logger.log('Seeding roles...');

    const roles = [
      {
        name: RoleName.ADMIN,
        description: 'Administrator with full system access',
        isActive: true,
      },
      {
        name: RoleName.EDITOR,
        description: 'Editor with content management permissions',
        isActive: true,
      },
      {
        name: RoleName.VIEWER,
        description: 'Viewer with read-only access',
        isActive: true,
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name }
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        this.logger.log(`Created role: ${roleData.name}`);
      } else {
        this.logger.log(`Role already exists: ${roleData.name}`);
      }
    }
  }

  private async seedUsers(): Promise<void> {
    this.logger.log('Seeding users...');

    // Check if admin user already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@fptsoftware.com' }
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = this.userRepository.create({
        email: 'admin@fptsoftware.com',
        passwordHash: adminPassword,
        fullName: 'System Administrator',
        role: RoleName.ADMIN,
        isActive: true,
      });

      await this.userRepository.save(adminUser);
      this.logger.log('Created admin user: admin@fptsoftware.com');
    } else {
      this.logger.log('Admin user already exists');
    }

    // Check if editor user already exists
    const existingEditor = await this.userRepository.findOne({
      where: { email: 'editor@fptsoftware.com' }
    });

    if (!existingEditor) {
      const editorPassword = await bcrypt.hash('editor123', 10);
      
      const editorUser = this.userRepository.create({
        email: 'editor@fptsoftware.com',
        passwordHash: editorPassword,
        fullName: 'Content Editor',
        role: RoleName.EDITOR,
        isActive: true,
      });

      await this.userRepository.save(editorUser);
      this.logger.log('Created editor user: editor@fptsoftware.com');
    } else {
      this.logger.log('Editor user already exists');
    }
  }
}
