import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BusController],
  providers: [BusService],
  imports: [PrismaModule],
})
export class BusModule {}
