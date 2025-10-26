import {DBServiceTest} from '../_db'
import {LogDBService} from './logDB.service'

export class LogDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static logDBService = new LogDBService(LogDBServiceTest.dbService)
}
