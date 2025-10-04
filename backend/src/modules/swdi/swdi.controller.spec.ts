import { Test, TestingModule } from '@nestjs/testing';
import { SwdiController } from './swdi.controller';
import { SwdiService } from './swdi.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { JwtOrRefreshGuard } from '../../jwt/jwt-refresh-guard';
import { ExecutionContext } from '@nestjs/common';

describe('SwdiController', () => {
  let controller: SwdiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwdiController],
      providers: [
        SwdiService,
        PrismaService,
        Reflector,
      ],
    })
      .overrideGuard(JwtOrRefreshGuard)
      .useValue({ canActivate: (_context: ExecutionContext) => true })
      .compile();

    controller = module.get<SwdiController>(SwdiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
