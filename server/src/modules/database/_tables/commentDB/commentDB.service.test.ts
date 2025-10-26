import {DBServiceTest} from '../_db'
import {CommentDBService} from './commentDB.service'

export class CommentDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static commentDBService = new CommentDBService(CommentDBServiceTest.dbService)
}
