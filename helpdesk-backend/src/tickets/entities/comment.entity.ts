import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}