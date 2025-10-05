import { Test, TestingModule } from '@nestjs/testing';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtOrRefreshGuard } from '../../guard/jwt-refresh-guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';


describe('BusController', () => {
  let controller: BusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusController],
      providers: [
        BusService,
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

    controller = module.get<BusController>(BusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
