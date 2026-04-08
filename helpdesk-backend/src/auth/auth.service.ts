import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersRepository.findOne({ 
        where: { email },
        relations: ['company', 'sector']
    });

    if (!user || user.password_hash !== pass) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = { 
        email: user.email, 
        sub: user.id,
        role: user.role,
        companyId: user.company.id,
        sectorId: user.sector.id
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
          name: user.name,
          email: user.email,
          company: user.company.name,
          sector: user.sector.name
      }
    };
  }
}