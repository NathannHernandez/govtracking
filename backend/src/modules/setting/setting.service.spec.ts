import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
