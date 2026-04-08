import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpdeskModule as HelpdeskEntity } from './entities/helpdesk-module.entity';
import { HelpdeskService } from './helpdesk.service';
import { HelpdeskController } from './helpdesk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HelpdeskEntity])],
  controllers: [HelpdeskController],
  providers: [HelpdeskService],
  exports: [TypeOrmModule],
})
export class HelpdeskModule {}