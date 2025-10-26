import {DBHubServiceTest} from '../../dbHub'
import {LoggerPortService} from './loggerPort.service'

export class LoggerPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static loggerPortService = new LoggerPortService(LoggerPortServiceTest.dbHubService)
}
