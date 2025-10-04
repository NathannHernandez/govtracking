import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';



@Injectable()
export class UserService {
  constructor(private prisma : PrismaService) {}

  async updateUserInfo(createUserDto: CreateUserDto) {

    const CurrentUser = await this.prisma.userInfo.update({
      where : {
        userId : Number(createUserDto.userId)
      },
      data : {
        firstName : createUserDto.firstName,
        lastName : createUserDto.lastName,
        phone : createUserDto.phone,
        email : createUserDto.email,
        username : createUserDto.username,
      }
    })

    return {CurrentUser}
}

  async GetAllUser(){
    return this.prisma.userInfo.findMany()
  }

}
