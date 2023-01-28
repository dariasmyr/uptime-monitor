// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

import { LoggerService } from '../logger/logger.service';
import { stringifyFormatted } from '../tools/tools';

export interface SaveReportParameters {
  host: string;
  healthCheckIsAlive: boolean;
  healthCheckBody: string;
  httpCheckIsAlive: boolean;
  httpCheckStatusCode: number;
  pingCheckIsAlive: boolean;
  pingCheckTimeMs: number;
  sslCheckIsAlive: boolean;
  sslCheckDaysLeft: number;
}

export class DatabaseRepository {
  private logger: LoggerService;
  prisma: PrismaClient;

  constructor() {
    this.logger = new LoggerService('SslService');
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
    } catch (error: any) {
      this.logger.error('Error adding row: ', error.message);
      return false;
    }
  }

  // eslint-disable-next-line consistent-return
  async deleteOldRecords(countToKeep: any): Promise<number | undefined> {
    const total = await this.prisma.uptime.count();
    this.logger.debug('Total rows:', total);
    if (total > countToKeep) {
      // Find latest countToKeep rows, and delete all others rows
      const rowsToDelete = await this.prisma.uptime.findMany({
        orderBy: { id: 'desc' },
        cursor: {
          id: countToKeep,
        },
      });

      const idsToDelete = rowsToDelete.map((row) => row.id);
      this.logger.debug('Deleting rows with ids:', idsToDelete);

      const deletedRows = await this.prisma.uptime.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });

      const recordsKept = await this.prisma.uptime.count();
      this.logger.debug('Deleted rows:', deletedRows);
      return recordsKept;
    } else {
      console.log('No rows deleted');
      return undefined;
    }
  }
}
