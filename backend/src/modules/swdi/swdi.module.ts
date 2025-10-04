import { Module } from '@nestjs/common';
import { SwdiService } from './swdi.service';
import { SwdiController } from './swdi.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SwdiController],
  providers: [SwdiService],
  imports: [PrismaModule]
})
export class SwdiModule {}
