import { Test, TestingModule } from '@nestjs/testing';
import { PcnController } from './pcn.controller';
import { PcnService } from './pcn.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtOrRefreshGuard } from '../../guard/jwt-refresh-guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('PcnController', () => {
  let controller: PcnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcnController],
      providers: [
        PcnService,
        {
          provide: PrismaService,
          useValue: {},
        },
        Reflector,
      ],
    })
      .overrideGuard(JwtOrRefreshGuard)
      .useValue({ canActivate: (_context: ExecutionContext) => true })
      .compile();

    controller = module.get<PcnController>(PcnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
