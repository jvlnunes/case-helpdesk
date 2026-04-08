import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Sector } from './entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Sector])],
  exports: [TypeOrmModule], 
})
export class UsersModule {}