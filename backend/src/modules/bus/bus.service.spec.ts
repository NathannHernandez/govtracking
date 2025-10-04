import { Test, TestingModule } from '@nestjs/testing';
import { BusService } from './bus.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('BusService', () => {
  let service: BusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusService, PrismaService],
    }).compile();

    service = module.get<BusService>(BusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
