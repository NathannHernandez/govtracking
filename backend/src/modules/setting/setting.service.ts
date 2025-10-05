import { Injectable } from '@nestjs/common';
import Papa from 'papaparse';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type User = {
  userId: number
  username: string
}

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService, private jwtService: JwtService,) { }



  async importCVSBus(file: Express.Multer.File, req: Request) {
    try {
      //const currentUser = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
      const { userId, username } = req.user as User
      const expectedHeader = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'subjectOfChange', 'date']

      const csvString = file.buffer.toString('utf-8');
      console.log(csvString)
      const parsed = Papa.parse(csvString, { header: true, dynamicTyping: true });

      const data = (parsed.data as Record<string, any>[]).filter(
        row => Object.values(row).some(value => value !== null && value !== '')
      );

      const errors = data
        .map((row, index) => {
          const missingColumns = expectedHeader.filter(h => !row[h]);
          return missingColumns.length > 0 ? `${index + 1} error: missing ${missingColumns.join(', ')}` : null;
        })
        .filter(Boolean);

      if (errors.length > 0) return { success: false, errors };


      let insertedCount = 0;

      for (const row of data) {
        const bus = await this.prisma.bus.create({
          data: {
            lgu: row.lgu,
            barangay: row.barangay,
            hhId: row.hhId.toString(),
            granteeName: row.granteeName,
            typeOfUpdate: row.typeOfUpdate.toString(),
            encoded: row.encoded,
            issue: row.issue,
            subjectOfChange: row.subjectOfChange,
            date: row.date ? new Date(row.date) : new Date(),
            userId: Number(userId),
            username: username,
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

        insertedCount++;  // Increment count on successful insert
      }

      return { success: true, inserted: insertedCount };


    } catch (error) {
      console.error('CSV import failed:', error);
      return { success: false, error: error.message || error };
    }
  }

async importCVSPCN(file: Express.Multer.File, req: Request) {
  try {
    const { userId, username } = req.user as User;
    const expectedHeader = ['hhId', 'grantee', 'encoded', 'date'];

    const csvString = file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvString, { header: true, dynamicTyping: true });

    const data = (parsed.data as Record<string, any>[]).filter(
      row => Object.values(row).some(value => value !== null && value !== '')
    );

    const errors = data
      .map((row, index) => {
        const missingColumns = expectedHeader.filter(h => !row[h]);
        return missingColumns.length > 0 ? `${index + 1} error: missing ${missingColumns.join(', ')}` : null;
      })
      .filter(Boolean);

    if (errors.length > 0) return { success: false, errors };

    let insertedCount = 0;

    for (const row of data) {
      const pcnRecord = await this.prisma.pcn.create({
        data: {
          hhId: row.hhId != null ? row.hhId.toString() : '',
          grantee: row.grantee,
          pcn: row.pcn != null ? row.pcn.toString() : '',
          tr: row.tr != null ? row.tr.toString() : '',
          encoded: row.encoded,
          issue: row.issue,
          date: row.date ? new Date(row.date) : new Date(),
          userId: Number(userId),
          username: username,
        },
      });

      await this.prisma.encodedDocument.create({
        data: {
          hhId: pcnRecord.hhId,
          documentType: 'PCN',
          documentId: pcnRecord.id,
          name: pcnRecord.grantee,
          encoded: pcnRecord.encoded,
          userId: pcnRecord.userId,
          username: pcnRecord.username,
          date: pcnRecord.date,
        },
      });

      insertedCount++;
    }

    return { success: true, inserted: insertedCount };

  } catch (error) {
    console.error('CSV import failed:', error);
    return { success: false, error: error.message || error };
  }
}


async importCVSSwdi(file: Express.Multer.File, req: Request) {
  try {
    const { userId, username } = req.user as User;
    const expectedHeader = ['hhId', 'grantee', 'swdiScore', 'encoded', 'date'];

    const csvString = file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvString, { header: true, dynamicTyping: true });

    const data = (parsed.data as Record<string, any>[]).filter(
      row => Object.values(row).some(value => value !== null && value !== '')
    );

    const errors = data
      .map((row, index) => {
        const missingColumns = expectedHeader.filter(h => !row[h]);
        return missingColumns.length > 0 ? `${index + 1} error: missing ${missingColumns.join(', ')}` : null;
      })
      .filter(Boolean);

    if (errors.length > 0) return { success: false, errors };

    let insertedCount = 0;

    for (const row of data) {
      const swdiRecord = await this.prisma.swdi.create({
        data: {
          hhId: row.hhId.toString(),
          grantee: row.grantee,
          swdiScore: row.swdiScore.toString(),
          encoded: row.encoded,
          issue: row.issue,
          date: row.date ? new Date(row.date) : new Date(),
          userId: Number(userId),
          username: username,
        },
      });

      await this.prisma.encodedDocument.create({
        data: {
          hhId: swdiRecord.hhId,
          documentType: 'SWDI',
          documentId: swdiRecord.id,
          name: swdiRecord.grantee,
          encoded: swdiRecord.encoded,
          userId: swdiRecord.userId,
          username: swdiRecord.username,
          date: swdiRecord.date,
        },
      });

      insertedCount++;
    }

    return { success: true, inserted: insertedCount };

  } catch (error) {
    console.error('CSV import failed:', error);
    return { success: false, error: error.message || error };
  }
}

}
