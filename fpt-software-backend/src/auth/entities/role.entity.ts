import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { RoleName } from '../enums/role.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
    nullable: false
  })
  name: RoleName;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  description: string;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
