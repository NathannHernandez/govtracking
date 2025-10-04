import { Test, TestingModule } from '@nestjs/testing';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('SettingController', () => {
  let controller: SettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [
        SettingService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: { sign: () => 'token', verify: () => ({}) },
        },
      ],
    }).compile();

    controller = module.get<SettingController>(SettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
