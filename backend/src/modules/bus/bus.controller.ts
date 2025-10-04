import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query , Req} from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';
import type { Request } from 'express';

@UseGuards(JwtOrRefreshGuard)
@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) { }


  @Get('records')
  fetchAllBus(@Req() req : Request) {
    return this.busService.fetchAllBus(req);
  }


  @Post('insert')
  InsertBusData(
    @Body() busForm: CreateBusDto,
    @Req() req : Request
  ) {
  
    return this.busService.InsertBusData(busForm,req)
  }


  @Get('all')
  getAllBus(){
    return this.busService.getAllBuss()
  }


  @Get('recent')
    getRecent(
      @Req() req : Request
    ){
      return this.busService.getRecentBus(req)
    }
  

}
