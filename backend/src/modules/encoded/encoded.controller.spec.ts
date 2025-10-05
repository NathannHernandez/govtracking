import { Test, TestingModule } from '@nestjs/testing';
import { EncodedController } from './encoded.controller';
import { EncodedService } from './encoded.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtOrRefreshGuard } from '../../guard/jwt-refresh-guard';
import {  ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('EncodedController', () => {
  let controller: EncodedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncodedController],
      providers: [
        EncodedService,
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

    controller = module.get<EncodedController>(EncodedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
