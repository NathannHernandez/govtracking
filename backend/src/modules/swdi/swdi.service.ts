import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSwdiDto } from './dto/create-swdi.dto';
import { UpdateSwdiDto } from './dto/update-swdi.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { Request } from 'express';


type reqUser = {
  username : string
  userId: number
}

@Injectable()
export class SwdiService {
  constructor(private prisma: PrismaService) { }

  async fetchAllSwdi(req : Request) {
    if(!req.user) { throw new Error("Unauthorized")}
    const user = req.user as reqUser
    return await this.prisma.swdi.findMany({
      where: {
        userId: user.userId,
      },
    });
  }

  async insertSwdiForm(form: CreateSwdiDto, req : Request) {
    if(!req.user) { throw new Error("Unauthorized")}
    const user = req.user as reqUser
    const formYear = new Date(form.date).getFullYear()

    const checkYes = await this.prisma.swdi.findFirst({
      where: {
        hhId: form.hhId,
        encoded: 'YES',
        date: {
          gte: new Date(`${formYear}-01-01`),
          lt: new Date(`${formYear + 1}-01-01`),
        },
      },
    })

    if (checkYes && form.encoded === 'YES') {
      throw new BadRequestException(
        'This household already has an encoded record for this year.'
      )
    }
    console.log({
        ...form,
        userId: user.userId,
        username: user.username
      })

    const swdi = await this.prisma.swdi.create({
      data: {
        ...form,
        userId: user.userId,
        username: user.username
      },
    })

    await this.prisma.encodedDocument.create({
      data: {
        hhId: swdi.hhId,
        name: swdi.grantee,
        documentType: 'SWDI',
        documentId: swdi.id,
        encoded: swdi.encoded,
        userId: swdi.userId,
        username: swdi.username,
        date: swdi.date
      }
    });

    return swdi;

  }
  async getRecentSwdi(req : Request) {
    if(!req.user) { throw new Error("Unauthorized")}
    const user = req.user as reqUser
    console.log("USER : ", user)

    try {
      return await this.prisma.swdi.findMany({
        where: {
          userId: user.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch recent bus records.');
    }
  }

}
// id: number;
//userId
// username: string;
// hhId: string;
// grantee: string;
// swdiScore: string;
// encoded: string;
// issue: string;
// date: string;