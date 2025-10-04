import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module'
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SettingController],
  providers: [SettingService, JwtService],
  imports : [PrismaModule]
})
export class SettingModule {}
