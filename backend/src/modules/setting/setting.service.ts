import { Injectable } from '@nestjs/common';
import Papa from 'papaparse';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';


type User = {
  id: number
  username: string
}

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService, private jwtService: JwtService,) { }


  async importCVSBus(file: Express.Multer.File, token: string) {
    try {
      const currentUser = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
      const { userId, username } = currentUser
       //console.log("Current User : ", currentUser)
      const csvHeaders = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'issue', 'subjectOfChange', 'date', 'userId', 'username'];
      const expectedHeader = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'subjectOfChange', 'date']

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


      const created = await this.prisma.bus.createMany({
        data: data.map(row => ({
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
        })),
      });

      return { success: true, inserted: created.count };

    } catch (error) {
      console.error('CSV import failed:', error);
      return { success: false, error: error.message || error };
    }
  }

  
  async importCVSPCN(file: Express.Multer.File, token: string) {
    try {
      const currentUser = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
      const { userId, username } = currentUser
       //console.log("Current User : ", currentUser)
      const csvHeaders = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'issue', 'subjectOfChange', 'date', 'userId', 'username'];
      const expectedHeader = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'subjectOfChange', 'date']

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


      const created = await this.prisma.bus.createMany({
        data: data.map(row => ({
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
        })),
      });

      return { success: true, inserted: created.count };

    } catch (error) {
      console.error('CSV import failed:', error);
      return { success: false, error: error.message || error };
    }
  }

  
  async importCVSSwdi(file: Express.Multer.File, token: string) {
    try {
      const currentUser = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
      const { userId, username } = currentUser
       //console.log("Current User : ", currentUser)
      const csvHeaders = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'issue', 'subjectOfChange', 'date', 'userId', 'username'];
      const expectedHeader = ['lgu', 'barangay', 'hhId', 'granteeName', 'typeOfUpdate', 'encoded', 'subjectOfChange', 'date']

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


      const created = await this.prisma.bus.createMany({
        data: data.map(row => ({
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
        })),
      });

      return { success: true, inserted: created.count };

    } catch (error) {
      console.error('CSV import failed:', error);
      return { success: false, error: error.message || error };
    }
  }

}
