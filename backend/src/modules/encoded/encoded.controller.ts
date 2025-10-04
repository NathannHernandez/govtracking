import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { EncodedService } from './encoded.service';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';



@UseGuards(JwtOrRefreshGuard)
@Controller('encoded')
export class EncodedController {
  constructor(private readonly encodedService: EncodedService) { }


  @Get('recent')
  getRecentEncoded(@Query('id') id: string) {
    return this.encodedService.getRecentEncoded(id);
  }


  @Get('dailystats')
  getDailyEncodingStats(
    @Query("id") id: string,
    @Query("days") days: string) {
    return this.encodedService.getDailyEncodingStats(id, days);
  }

  @Get('monthlystats')
  getMonthlyEncodingStats(
    @Query("id") id: string,
    @Query("month") month: string) {
    return this.encodedService.getMonthlyEncodingStats(id, month);
  }


  @Get('recentmonthlystats')
  getRecentMonthlyEncodingStats(
    @Query("id") id: string,
    @Query("month") month: string) {
    return this.encodedService.getRecentMonthlyEncodingStats(id, month);
  }


  @Get('total')
  getTotalEncoded(
    @Query("id") id: string,
    @Query("days") days: string
  ) {
    return this.encodedService.getTotalEncoded(id, days);
  }


  @Get('recentmonthlyeverydaystats')
  getRecentMonthlyEverydayEncodingStats(
    @Query("id") id: string,
    @Query("month") month: string) {
    return this.encodedService.getMonthlyEverydayStats(id, month);
  }


  @Get('getYearlyTotal')
  getYearlyTotal(
    @Query("id") id: string,
    @Query("year") year: string) {
    return this.encodedService.getYearlyTotal(id, year);
  }
}
