import { Test, TestingModule } from '@nestjs/testing';
import { PcnService } from './pcn.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PcnService', () => {
  let service: PcnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcnService, PrismaService],
    }).compile();

    service = module.get<PcnService>(PcnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
