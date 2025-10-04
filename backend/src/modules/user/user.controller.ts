import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';

@UseGuards(JwtOrRefreshGuard)
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
