import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


export type StatsData = {
  date: string;
  documentType: "PCN" | "BUS" | "SWDI";
  encoded: number;
  updated: number;
  issues: number;
};


@Injectable()
export class EncodedService {
  constructor(private prisma: PrismaService) { }

  async getRecentEncoded(id: string) {
    return await this.prisma.encodedDocument.findMany({
      where: {
        userId: Number(id),
      },
      take: 10,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getTotalEncoded(id: string, days: string) {
    const date = new Date();
    const daysNumber = Number(days);
    date.setDate(date.getDate() - daysNumber);
    return await this.prisma.encodedDocument.findMany({
      where: {
        userId: Number(id),
        date: {
          gte: date,
        },
      },
    });
  }

  async getDailyEncodingStats(userId: string, days: string) {
    const daysNumber = Number(days);
    const userIdNumber = Number(userId);
    const since = new Date();
    since.setDate(since.getDate() - daysNumber);

    const records = await this.prisma.encodedDocument.findMany({
      where: {
        userId: userIdNumber,
        date: { gte: since },
      },
      select: {
        date: true,
        encoded: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const grouped = records.reduce((acc, doc) => {
      const day = doc.date.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = { date: day, encoded: 0, updated: 0, issues: 0 };
      if (doc.encoded === 'YES') acc[day].encoded += 1;
      if (doc.encoded === 'UPDATED') acc[day].updated += 1;
      if (doc.encoded === 'NO') acc[day].issues += 1;
      return acc;
    }, {} as Record<string, { date: string; encoded: number; updated: number; issues: number }>);

    return Object.values(grouped);
  }

  async getMonthlyEncodingStats(userId: string, month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);


    const documents = await this.prisma.encodedDocument.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    const totalDocuments = documents.length;

    const documentsByType = documents.reduce((acc, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const documentsByStatus = documents.reduce((acc, doc) => {
      const status = doc.encoded ? "YES" : "NO";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyStats = documents.reduce((acc, doc) => {
      const date = doc.date.toISOString().split("T")[0];
      const existing = acc.find(d => d.date === date);
      if (existing) existing.count += 1;
      else acc.push({ date, count: 1 });
      return acc;
    }, [] as { date: string; count: number }[]);

    return {
      totalDocuments,
      documentsByType,
      documentsByStatus,
      dailyStats
    };
  }



  async getRecentMonthlyEncodingStats(userId: string, month: string) {
    
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
 

    const documents = await this.prisma.encodedDocument.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    return documents;
  }

async getMonthlyEverydayStats(userId: string, month: string) {
    const start = new Date(`${month}`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  // Fetch all documents for that user in the month
  const records = await this.prisma.encodedDocument.findMany({
    where: {
      userId: Number(userId),
      date: {
        gte: start,
        lt: end,
      },
    },
    select: {
      date: true,
      documentType: true,
      encoded: true, // "YES" | "UPDATED" | "NO"
    },
  });

  // Group by date and documentType
  const dailyMap: Record<string, Record<string, StatsData>> = {};

  records.forEach((r) => {
    const date = r.date.toISOString().split("T")[0];
    const documentType = r.documentType as "PCN" | "BUS" | "SWDI";

    if (!dailyMap[date]) dailyMap[date] = {};
    if (!dailyMap[date][documentType]) {
      dailyMap[date][documentType] = { date, documentType, encoded: 0, updated: 0, issues: 0 };
    }

    if (r.encoded === "YES") dailyMap[date][documentType].encoded += 1;
    else if (r.encoded === "UPDATED") dailyMap[date][documentType].updated += 1;
    else if (r.encoded === "NO") dailyMap[date][documentType].issues += 1;
  });

  // Flatten into array
  const result: StatsData[] = [];
  Object.values(dailyMap).forEach((typeMap) => {
    Object.values(typeMap).forEach((stat) => result.push(stat));
  });

  // Sort by date
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

  
async getYearlyTotal(userId: string, year: string) {
  const exactYear = Number(year)
  const stats = await this.prisma.encodedDocument.groupBy({
    by: ['date'],
    where: {
      userId: parseInt(userId),
      date: {
        gte: new Date(`${exactYear}-01-01`),
        lt: new Date(`${exactYear + 1}-01-01`),
      },
    },
    _count: {
      encoded: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  const monthlyTotals: { month: string; total: number }[] = [];

  stats.forEach(s => {
    const month = s.date.toISOString().split('T')[0].slice(0, 7); // YYYY-MM
    const existing = monthlyTotals.find(m => m.month === month);
    if (existing) {
      existing.total += s._count.encoded;
    } else {
      monthlyTotals.push({ month, total: s._count.encoded });
    }
  });

  return monthlyTotals;
}




}