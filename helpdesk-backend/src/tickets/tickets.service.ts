import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Comment } from './entities/comment.entity';
import { HelpdeskModule as HelpdeskEntity } from '../helpdesk/entities/helpdesk-module.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(HelpdeskEntity) private helpdeskRepo: Repository<HelpdeskEntity>,
  ) {}

  async findAllForUser(user: any) {
    const modules = await this.helpdeskRepo.find({
      where: { allowed_companies: { id: user.companyId } },
      relations: ['sector']
    });

    const moduleIds = modules.map(m => m.id);
    if (moduleIds.length === 0) return [];

    return this.ticketRepo.find({
      where: moduleIds.map(id => ({ helpdesk_module: { id } })),
      relations: ['helpdesk_module', 'helpdesk_module.sector', 'user'],
      order: { created_at: 'DESC' }
    });
  }

  async create(user: any, helpdeskModuleId: string, title: string, description: string, payload_data: any) {
    const module = await this.helpdeskRepo.findOne({
       where: { id: helpdeskModuleId, allowed_companies: { id: user.companyId } }
    });

    if (!module) throw new UnauthorizedException('Sua empresa não tem permissão para abrir chamados neste setor.');

    const ticket = this.ticketRepo.create({
      code: `#HD-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      payload_data,
      helpdesk_module: module,
      user: { id: user.id } as any
    });

    const savedTicket = await this.ticketRepo.save(ticket);
    
    this.logger.log(`[Notificação] Novo chamado criado (${savedTicket.code}) pelo usuário: ${user.email}`);
    
    return savedTicket;
  }

  async addComment(user: any, ticketId: string, text: string) {
    const comment = this.commentRepo.create({
      text,
      ticket: { id: ticketId } as any,
      user: { id: user.id } as any
    });

    if (text.includes('@')) {
       const mentions = text.match(/@\w+/g);
       if (mentions) {
         this.logger.log(`[Aviso] Usuários mencionados no chamado ${ticketId}: ${mentions.join(', ')}`);
       }
    }

    return this.commentRepo.save(comment);
  }

  async getComments(ticketId: string) {
    return this.commentRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['user'], 
      order: { created_at: 'ASC' }
    });
  }
}