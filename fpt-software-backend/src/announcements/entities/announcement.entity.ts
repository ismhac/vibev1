import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/interfaces/common.interface';

@Entity('announcements')
export class Announcement implements BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ 
    type: 'enum', 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  })
  priority: 'low' | 'medium' | 'high';

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'json', nullable: true })
  tags: string[] | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'int', nullable: true })
  readTime: number; // in minutes
}