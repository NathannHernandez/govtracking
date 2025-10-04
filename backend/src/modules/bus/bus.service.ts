import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';


type reqUser = {
  userId : string 
  username : string
}

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) { }



  async fetchAllBus(req : Request) {
    if(!req.user) {throw new Error("Unauthorized"); }
    const user = req.user as reqUser
    return await this.prisma.bus.findMany({
      where: {
        userId: Number(user.userId),
      },
      orderBy: { date: 'desc' },
    });
  }


  async InsertBusData(busForm: CreateBusDto, req : Request) {
    if(!req.user) {throw new Error("Unauthorized"); }
    console.log("FORM DATA : ", busForm)
    const user = req.user as reqUser
    try {

      const bus = await this.prisma.bus.create({
        data: {
          ...busForm,
          userId : Number(user.userId),
          username : user.username,
          date: new Date(busForm.date),
        },
      });

      await this.prisma.encodedDocument.create({
        data: {
          hhId: bus.hhId,
          documentType: 'BUS',
          documentId: bus.id,
          name: bus.granteeName,
          encoded: bus.encoded,
          userId: bus.userId,
          username: bus.username,
          date: bus.date,
        },
      });

      return bus;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create bus record: ${error.message}`,
      );
    }
  }



  async getAllBuss() {
    try {
      return await this.prisma.bus.findMany();
    } catch (error) {
      throw new BadRequestException('Failed to fetch bus records.');
    }
  }

  async getRecentBus(req: Request) {
    if(!req.user) {throw new Error("Unauthorized"); }
    const user = req.user as reqUser
    try {
      return await this.prisma.bus.findMany({
        where: {
          userId: Number(user.userId),
        },
        orderBy: {
          date: 'desc',
        },
        take: 3,
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch recent bus records.');
    }
  }
}
