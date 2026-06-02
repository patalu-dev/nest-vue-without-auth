import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
@Unique(['username', 'deletedAt'])
@Unique(['email', 'deletedAt'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'datetime', nullable: true })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
