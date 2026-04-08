import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @OneToMany(() => User, (user) => user.sector)
  users: User[];
}