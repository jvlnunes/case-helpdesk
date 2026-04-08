import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) 
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Req() req) {
    return this.ticketsService.findAllForUser(req.user);
  }

  @Post()
  create(@Req() req, @Body() body: any) {
    return this.ticketsService.create(
      req.user,
      body.helpdeskModuleId,
      body.title,
      body.description,
      body.payload_data
    );
  }

  @Post('comment')
  addComment(@Req() req, @Body() body: any) {
    return this.ticketsService.addComment(req.user, body.ticketId, body.text);
  }
  
  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.ticketsService.getComments(id);
  }
}