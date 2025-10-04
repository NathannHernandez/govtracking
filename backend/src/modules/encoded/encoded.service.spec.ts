import { Test, TestingModule } from '@nestjs/testing';
import { EncodedService } from './encoded.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('EncodedService', () => {
  let service: EncodedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncodedService, PrismaService],
    }).compile();

    service = module.get<EncodedService>(EncodedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
