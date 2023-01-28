import { PrismaClient } from '@prisma/client';

import { LoggerService } from '../logger/logger.service';
import { stringifyFormatted } from '../tools/tools';

export interface SaveReportParameters {
  host: string;
  healthCheckIsAlive: boolean | 'disabled';
  healthCheckBody: string;
  httpCheckIsAlive: boolean | 'disabled';
  httpCheckStatusCode: number;
  pingCheckIsAlive: boolean | 'disabled';
  pingCheckTimeMs: number;
  sslCheckIsAlive: boolean | 'disabled';
  sslCheckDaysLeft: number;
}

export class DatabaseRepository {
  private logger: LoggerService;
  prisma: PrismaClient;

  constructor() {
    this.logger = new LoggerService('DatabaseRepository');
    this.prisma = new PrismaClient();
  }

  async saveReport(data: SaveReportParameters) {
    this.logger.debug(
      'Saving report with params: ',
      stringifyFormatted({
        host: data.host,
        healthCheckIsAlive: data.healthCheckIsAlive,
        healthCheckBody: data.healthCheckBody,
        httpCheckIsAlive: data.httpCheckIsAlive,
        httpCheckStatusCode: data.httpCheckStatusCode,
        pingCheckIsAlive: data.pingCheckIsAlive,
        pingCheckTimeMs: data.pingCheckTimeMs,
        sslCheckIsAlive: data.sslCheckIsAlive,
        sslCheckDaysLeft: data.sslCheckDaysLeft,
      }),
    );
    try {
      const row = await this.prisma.uptime.create({
        data: {
          host: data.host,
          healthCheckIsAlive: data.healthCheckIsAlive.toString(),
          healthCheckResponseBody: data.healthCheckBody,
          httpCheckIsAlive: data.httpCheckIsAlive.toString(),
          httpCheckStatusCode: data.httpCheckStatusCode,
          pingCheckIsAlive: data.pingCheckIsAlive.toString(),
          pingCheckTimeMs: data.pingCheckTimeMs,
          sslCheckIsAlive: data.sslCheckIsAlive.toString(),
          sslCheckDaysLeft: data.sslCheckDaysLeft,
        },
      });
      this.logger.debug(
        'Row added: ',
        stringifyFormatted(row),
        'with id: ',
        row.id,
      );
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error('Error adding row: ', error.message);
      return false;
    }
  }

  async deleteOldRecords(countToKeep: number): Promise<boolean> {
    const recordsToKeep = await this.prisma.uptime.findMany({
      orderBy: {
        id: 'desc',
      },
      take: countToKeep,
    });

    await this.prisma.uptime.deleteMany({
      where: {
        id: {
          notIn: recordsToKeep.map((record) => record.id),
        },
      },
    });

    return true;
  }
}
