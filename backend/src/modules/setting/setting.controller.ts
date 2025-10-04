import { Controller, Post, UploadedFile, UseInterceptors,UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingService } from './setting.service';
import { Cookies } from '../../common/decorators/cookies.decorator';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';
import { Multer } from 'multer';

@UseGuards(JwtOrRefreshGuard)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

@Post('cvs-upload-bus')
@UseInterceptors(FileInterceptor('file'))
async uploadCsv(
  @UploadedFile() file: Express.Multer.File,
  @Cookies('access_token') token : string
) {
  return this.settingService.importCVSBus(file, token);
}

@Post('cvs-upload-pcn')
@UseInterceptors(FileInterceptor('file'))
async uploadCsvPcn(
  @UploadedFile() file: Express.Multer.File,
  @Cookies('access_token') token : string
) {
  return this.settingService.importCVSPCN(file, token);
}

@Post('cvs-upload-swdi')
@UseInterceptors(FileInterceptor('file'))
async uploadCsvSwdi(
  @UploadedFile() file: Express.Multer.File,
  @Cookies('access_token') token : string
) {
  return this.settingService.importCVSSwdi(file, token);
}

}
