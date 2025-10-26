import {DBServiceTest} from '../_db'
import {DirectoryDBService} from './directoryDB.service'

export class DirectoryDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static directoryDBService = new DirectoryDBService(DirectoryDBServiceTest.dbService)
}
