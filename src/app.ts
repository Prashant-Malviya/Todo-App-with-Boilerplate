import express, { Application } from 'express';
import { Server } from 'http';
import serverErrorHandler from './error-handler';
import AccesstokenServiceManager from './modules/access-token/access-token-manager';
import AccountServiceManager from './modules/account/account-service-manager';
import CommunicationServiceManager from './modules/communication/communication-service-manager';
import ConfigManager from './modules/config/config-manager';
import ConfigService from './modules/config/config-service';
import LoggerManager from './modules/logger/logger-manager';

export default class App {
  private static app: Application;

  public static async startRESTApiServer(): Promise<Server> {
    this.app = express();

    // Core Services
    await ConfigManager.mountConfig();
    await LoggerManager.mountLogger();
    await CommunicationServiceManager.mountService();

    // Micro Services
    const accountServiceRESTApi = await AccountServiceManager.createRestAPIServer();
    this.app.use('/', accountServiceRESTApi);

    const accessTokenServiceRESTApi = await AccesstokenServiceManager.createRestAPIServer();
    this.app.use('/', accessTokenServiceRESTApi);

    // Error handling
    this.app.use(serverErrorHandler);

    const port = ConfigService.getIntValue('server.port');
    return this.app.listen(port);
  }
}