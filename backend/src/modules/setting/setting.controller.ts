import { Controller, Post, UploadedFile, UseInterceptors,UseGuards, Body, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingService } from './setting.service';

import { JwtOrRefreshGuard } from '../../guard/jwt-refresh-guard';
import { Multer } from 'multer';
import { CsrfGuard } from 'src/guard/csrf-guard';
import type { Request } from 'express';


@UseGuards(JwtOrRefreshGuard,CsrfGuard)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

@Post('cvs-upload-bus')
@UseInterceptors(FileInterceptor('file'))
async uploadCsv(
  @UploadedFile() file: Express.Multer.File,
  @Req() req : Request
) {
    console.log('Received file:', file); // << Add this log
  if (!file) {
    return { success: false, error: 'No file uploaded' };
  }
  return this.settingService.importCVSBus(file, req);
}

@Post('cvs-upload-pcn')
@UseInterceptors(FileInterceptor('file'))
async uploadCsvPcn(
  @UploadedFile() file: Express.Multer.File,
  @Req() req : Request
) {
  return this.settingService.importCVSPCN(file, req);
}

@Post('cvs-upload-swdi')
@UseInterceptors(FileInterceptor('file'))
async uploadCsvSwdi(
  @UploadedFile() file: Express.Multer.File,
  @Req() req : Request
) {
  return this.settingService.importCVSSwdi(file, req);
}

}
