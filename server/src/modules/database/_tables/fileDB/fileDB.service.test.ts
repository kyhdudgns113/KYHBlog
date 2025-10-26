import {DBServiceTest} from '../_db'
import {FileDBService} from './fileDB.service'

export class FileDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static fileDBService = new FileDBService(FileDBServiceTest.dbService)
}
