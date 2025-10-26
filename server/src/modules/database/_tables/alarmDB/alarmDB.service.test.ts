import {DBServiceTest} from '../_db'
import {AlarmDBService} from './alarmDB.service'

export class AlarmDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static alarmDBService = new AlarmDBService(AlarmDBServiceTest.dbService)
}
