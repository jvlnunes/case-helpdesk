import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Company } from './users/entities/company.entity';
import { Sector } from './users/entities/sector.entity';
import { HelpdeskModule as HelpdeskEntity } from './helpdesk/entities/helpdesk-module.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Sector) private sectorRepo: Repository<Sector>,
    @InjectRepository(HelpdeskEntity) private helpdeskRepo: Repository<HelpdeskEntity>,
  ) {}

  async seed() {
    const existingUser = await this.userRepo.findOne({ where: { email: 'caseestagio@gmail.com' } });
    if (existingUser) return 'Banco já populado! Pode seguir.';

    const company1 = await this.companyRepo.save({ name: 'FORTALPLAST' });
    const company2 = await this.companyRepo.save({ name: 'RAPOSO PLÁSTICOS' });

    const sectorTI = await this.sectorRepo.save({ name: 'TI' });
    const sectorRH = await this.sectorRepo.save({ name: 'RH' });

    await this.userRepo.save({
      name: 'Case Estagio',
      email: 'caseestagio@gmail.com', 
      password_hash: 'YZCcQ7%i07NZO', 
      role: 'ADMIN',
      company: company1,
      sector: sectorTI,
    });


    await this.helpdeskRepo.save({
      sector: sectorTI,
      is_active: true,
      schema_fields: [
        { name: 'tipo_problema', label: 'Tipo de Problema', type: 'select', options: ['Hardware', 'Software', 'Rede', 'Acesso'], required: true }, 
        { name: 'ativo', label: 'Ativo Relacionado', type: 'text', required: false }, 
        { name: 'urgencia', label: 'Urgência', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Crítica'], required: true } 
      ],
      allowed_companies: [company1, company2] 
    });

    await this.helpdeskRepo.save({
      sector: sectorRH,
      is_active: true,
      schema_fields: [
        { name: 'assunto', label: 'Assunto', type: 'select', options: ['Férias', 'Benefícios', 'Ponto Eletrônico'], required: true }, 
        { name: 'matricula', label: 'Matrícula do Funcionário', type: 'text', required: true } 
      ],
      allowed_companies: [company1] 
    });

    return 'Seed executado com sucesso! Dados iniciais criados e vinculados.';
  }
}