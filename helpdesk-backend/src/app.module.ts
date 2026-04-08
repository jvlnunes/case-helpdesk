import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Nossos módulos do sistema
import { UsersModule } from './users/users.module';
import { HelpdeskModule } from './helpdesk/helpdesk.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module'; 

import { User } from './users/entities/user.entity';
import { Company } from './users/entities/company.entity';
import { Sector } from './users/entities/sector.entity';
import { HelpdeskModule as HelpdeskEntity } from './helpdesk/entities/helpdesk-module.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'adminpassword',
      database: 'helpdesk',
      autoLoadEntities: true,
      synchronize: true, 
      logging: false, 
    }),
    TypeOrmModule.forFeature([User, Company, Sector, HelpdeskEntity]), 
    UsersModule,
    HelpdeskModule,
    TicketsModule,
    AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}