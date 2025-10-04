import { Module } from '@nestjs/common';
import { EncodedService } from './encoded.service';
import { EncodedController } from './encoded.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [EncodedController],
  providers: [EncodedService],
  imports: [PrismaModule],
})
export class EncodedModule {}
