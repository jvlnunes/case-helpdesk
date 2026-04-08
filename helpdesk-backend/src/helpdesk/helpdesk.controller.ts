import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('helpdesk-modules')
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  @Get()
  getModules(@Req() req) {
    return this.helpdeskService.getModulesForCompany(req.user.companyId);
  }
}