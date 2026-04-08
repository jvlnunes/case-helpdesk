import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Comment } from './entities/comment.entity';
import { HelpdeskModule as HelpdeskEntity } from '../helpdesk/entities/helpdesk-module.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Comment, HelpdeskEntity])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}