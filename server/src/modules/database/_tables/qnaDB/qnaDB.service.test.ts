import {DBServiceTest} from '../_db'
import {QnaDBService} from './qnaDB.service'

export class QnaDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static qnaDBService = new QnaDBService(QnaDBServiceTest.dbService)
}

