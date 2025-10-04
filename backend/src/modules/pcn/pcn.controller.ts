import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { PcnService } from './pcn.service';
import { CreatePcnDto } from './dto/create-pcn.dto';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';

@UseGuards(JwtOrRefreshGuard)
@Controller('pcn')
export class PcnController {
  constructor(private readonly pcnService: PcnService) { }


  @Get('records')
  fetchAllPcn(@Query('id') id: string) {
    return this.pcnService.fetchAllPcn(id);
  }


  @Post('insert')
  insertPcnForm(@Body() createPcnDto: CreatePcnDto) {
    return this.pcnService.insertPcnForm(createPcnDto);
  }


  @Get('pending')
  getPendingPC(@Query('id') id: string) {
   
    return this.pcnService.getPendingPC(id);
  }


  @Get('encoded')
  getEncodedPC(@Query('id') id: string) {
    return this.pcnService.getEncodedPC(id);
  }

  
  @Get('recent')
  getRecentPCN(@Query('id') id: string) {
    return this.pcnService.getRecentPCN(id);
  }

}