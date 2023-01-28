import tls from 'node:tls';

import { LoggerService } from '../../logger/logger.service';
import { CheckResult, CheckType } from '../available-checker.service';

class SSLCertificateInfo {
  validFrom: string;
  validTo: string;
}

export class SslCheckerService {
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('SslService');
  }

  getCertInfo(
    _host: string,
    _port: number,
    _timeout: number,
  ): Promise<SSLCertificateInfo> {
    const options = {
      host: _host,
      port: _port,
      servername: _host,
    };
    const timeout = _timeout;
    return new Promise((resolve, reject) => {
      const result = new SSLCertificateInfo();
      const socket = tls.connect(options);
      socket.setTimeout(timeout);

      socket.once('secureConnect', () => {
        const peerCertificate = socket.getPeerCertificate();
        result.validFrom = peerCertificate.valid_from;
        result.validTo = peerCertificate.valid_to;
        socket.destroy();
      });

      socket.once('close', () => {
        resolve(result);
      });

      socket.once('error', (error: any) => {
        reject(error);
      });

      socket.once('timeout', () => {
        reject(new Error(`Timeout after ${timeout} ms for ${options}`));
      });
    });
  }

  async getRemainingDays(
    _host: string,
    _port: number,
    _timeout: number,
  ): Promise<CheckResult<CheckType.SSL>> {
    const certInfo = await this.getCertInfo(_host, _port, _timeout);
    const certExpirationDate = new Date(certInfo.validTo).valueOf();
    const now = Date.now();
    if (certExpirationDate < now) {
      this.logger.error('Certificate is expired');
      return {
        isAlive: false,
        type: CheckType.SSL,
        receivedData: {
          remainingDays: -1,
        },
      };
    } else {
      // eslint-disable-next-line no-magic-numbers
      const MIN_MS_IN_DAY = 1000 * 60 * 60 * 24;
      const remainingDays = Math.floor(
        (certExpirationDate - now) / MIN_MS_IN_DAY,
      );
      this.logger.debug(`Certificate is valid for ${remainingDays} days`);
      return {
        isAlive: true,
        type: CheckType.SSL,
        receivedData: {
          remainingDays: remainingDays,
        },
      };
    }
  }
}
