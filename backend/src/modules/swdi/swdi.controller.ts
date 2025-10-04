import { Controller, Get, Post, Body, Req, Param, UseGuards, Query } from '@nestjs/common';
import { SwdiService } from './swdi.service';
import { CreateSwdiDto } from './dto/create-swdi.dto';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';
import type { Request } from 'express';

@UseGuards(JwtOrRefreshGuard)
@Controller('swdi')
export class SwdiController {
  constructor(private readonly swdiService: SwdiService) { }


  @Get('records')
  fetchAllSwdi(@Req() req : Request) {
    return this.swdiService.fetchAllSwdi(req);
  }


  @Post('insert')
  insertSwdiForm(
    @Body() data: CreateSwdiDto,
    @Req() req : Request
  ) {
    return this.swdiService.insertSwdiForm(data, req)
  }



  @Get('recent')
  getRecentSwdi(
    @Req() req : Request
  ) {
    return this.swdiService.getRecentSwdi(req)
  }
}
