import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { RoleName } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  fullName: string;

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.VIEWER
  })
  role: RoleName;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
