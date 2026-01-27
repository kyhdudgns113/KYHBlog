import {DBServiceTest} from '../__db'
import {DirectoryFileDBService} from './directoryFileDB.service'

export class DirectoryFileDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static directoryFileDBService = new DirectoryFileDBService(DirectoryFileDBServiceTest.dbService)
}
