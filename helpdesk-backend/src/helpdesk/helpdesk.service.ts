import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpdeskModule as HelpdeskEntity } from './entities/helpdesk-module.entity';

@Injectable()
export class HelpdeskService {
  constructor(
    @InjectRepository(HelpdeskEntity)
    private helpdeskRepo: Repository<HelpdeskEntity>,
  ) {}

  async getModulesForCompany(companyId: string) {
    return this.helpdeskRepo.find({
      where: { 
        is_active: true,
        allowed_companies: { id: companyId } 
      },
      relations: ['sector'], 
    });
  }

  async toggleCompanyAccess(moduleId: string, companyId: string) {
      return { message: "Acesso multiempresa atualizado (Simulação)" };
  }
}