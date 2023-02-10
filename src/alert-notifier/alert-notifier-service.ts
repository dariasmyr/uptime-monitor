import { DatabaseRepository } from '../database/database.repository';
import { LoggerService } from '../logger/logger.service';

export class AlertNotifierService {
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService('AlertNotifierService');
  }

  // create a function that will send a message to telegram if the site is down. functiom should check if checkResolution is true or false in the database and if it is false, send a message to telegram
  async sendAlertMessage(site: string) {
    const databaseRepository = new DatabaseRepository();
    const checkResolution = await databaseRepository.getCheckResolution(site);
    this.logger.debug(
      `Check resolution from database for ${site}, : ${checkResolution}`,
    );
    return checkResolution === false
      ? `Site ${site} is DOWN. Please check it out!`
      : undefined;
  }
}
