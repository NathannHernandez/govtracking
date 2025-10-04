import { Test, TestingModule } from '@nestjs/testing';
import { SwdiService } from './swdi.service';
import { PrismaService } from '../../prisma/prisma.service';


describe('SwdiService', () => {
  let service: SwdiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwdiService, PrismaService],
    }).compile();

    service = module.get<SwdiService>(SwdiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
