import {DBServiceTest} from '../_db'
import {ChatDBService} from './chatDB.service'

export class ChatDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static chatDBService = new ChatDBService(ChatDBServiceTest.dbService)
}
