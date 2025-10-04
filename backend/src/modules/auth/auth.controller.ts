import { Controller, Post, Body, Get, Res, Logger, UseGuards, Req } from '@nestjs/common';
import { Cookies } from '../../common/decorators/cookies.decorator';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from '../../decorator/public.decorator';
import type { Request, Response } from 'express';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Get()
  getAll() {
    return this.authService.get()
  }

  @UseGuards(JwtOrRefreshGuard)
  @Get('check-auth')
  async check_auth(@Req() req: Request) {
    return this.authService.check_auth(req)

  }

  @Public()
  @Get('check-auth-public')
  async check_auth_public(@Req() req: Request) {

    const data = await this.authService.check_auth_public(req);
     //console.log("Payload : ", data)
    return data
  }


  @Public()
  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }


  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    const token = await this.authService.login(dto, req, res);



    return token;
  }

  //@UseGuards(JwtOrRefreshGuard)
  @Get('logout')
  async logout( @Res() res: Response) {
    return this.authService.logout( res);
  }


}
