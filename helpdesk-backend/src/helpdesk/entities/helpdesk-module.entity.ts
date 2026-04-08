import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Sector } from '../../users/entities/sector.entity';
import { Company } from '../../users/entities/company.entity';

@Entity('helpdesk_modules')
export class HelpdeskModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sector)
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ type: 'jsonb' })
  schema_fields: any; 

  @Column({ default: false })
  is_active: boolean;

  @ManyToMany(() => Company)
  @JoinTable({
    name: 'helpdesk_company_access',
    joinColumn: { name: 'helpdesk_module_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'company_id', referencedColumnName: 'id' },
  })
  allowed_companies: Company[];
}