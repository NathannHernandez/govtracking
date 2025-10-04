import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePcnDto } from './dto/create-pcn.dto';

import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class PcnService {
  constructor(private prisma: PrismaService) { }

    async fetchAllPcn(id: string) {
    return await this.prisma.pcn.findMany({
      where: {
        userId: Number(id),
      },
    });
  }



  async insertPcnForm(form: CreatePcnDto) {
    const pcn = await this.prisma.pcn.create({
      data: form,
    })

    await this.prisma.encodedDocument.create({
      data: {
        hhId: pcn.hhId,
        documentType: 'PCN',
        documentId: pcn.id,
        name: pcn.grantee,
        encoded: pcn.encoded,
        userId: pcn.userId,
        username: pcn.username,
        date: pcn.date
      }
    });
    return pcn;
  }


  async getPendingPC(id: string) {
    try {
      const pcn = await this.prisma.pcn.findMany({
        where: {
          userId: Number(id),
          encoded: 'PENDING',
        },
      });
      
      return pcn;
    } catch (error) {
      throw new BadRequestException('Failed to fetch pending PCN records.');
    }
  }

async getEncodedPC(id: string) {
  try {
    return await this.prisma.pcn.findMany({
      where: {
        userId: Number(id),
        encoded: {
          in: ['YES', 'UPDATED', 'NO'],
        },
      },
      take: 50,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    throw new BadRequestException('Failed to fetch encoded/updated PCN records.');
  }
}


async getRecentPCN(id: string) {
  try {
    return await this.prisma.pcn.findMany({
      where: {
        userId: Number(id),
      },
      take: 3,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    throw new BadRequestException('Failed to fetch recent PCN records.');
  } 
}

}