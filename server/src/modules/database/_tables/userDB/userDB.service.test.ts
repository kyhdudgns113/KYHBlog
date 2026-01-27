import {DBServiceTest} from '../__db'
import {UserDBService} from './userDB.service'

export class UserDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static userDBService = new UserDBService(UserDBServiceTest.dbService)
}
