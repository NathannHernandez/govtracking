import { Module } from '@nestjs/common';
import { PcnService } from './pcn.service';
import { PcnController } from './pcn.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PcnController],
  providers: [PcnService],
  imports: [PrismaModule]
})
export class PcnModule {}
