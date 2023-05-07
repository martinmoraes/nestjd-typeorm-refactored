import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import 'reflect-metadata';

@Entity({ name: 'users' })
export class UserEntity {
  @Expose({ toPlainOnly: true })
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Expose()
  @Column({
    length: 80,
  })
  name: string;

  @Expose()
  @Column({ length: 127, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ length: 127 })
  password: string;

  @Expose()
  @Column({ length: 20 })
  phone: string;

  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date;
}
