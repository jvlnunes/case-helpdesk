import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HelpdeskModule } from '../../helpdesk/entities/helpdesk-module.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string; 

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'Não Iniciado' })
  status: string;

  @Column({ default: 'Média' })
  priority: string;

  @Column({ type: 'jsonb', nullable: true })
  payload_data: any; 

  @ManyToOne(() => HelpdeskModule)
  @JoinColumn({ name: 'helpdesk_module_id' })
  helpdesk_module: HelpdeskModule;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; 

  @CreateDateColumn()
  created_at: Date;
}