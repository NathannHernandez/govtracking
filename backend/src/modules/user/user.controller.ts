import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtOrRefreshGuard } from '../../guard/jwt-refresh-guard';
import { CsrfGuard } from 'src/guard/csrf-guard';

@UseGuards(JwtOrRefreshGuard,CsrfGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Patch()
  updateUserInfo(@Body() CreateUserDto : CreateUserDto){

    return this.userService.updateUserInfo(CreateUserDto)
  }

  @Get()
  GetAllUser(){
    return this.userService.GetAllUser()
  }

}
