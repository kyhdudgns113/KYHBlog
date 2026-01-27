import {DBServiceTest} from '../__db'
import {CacheDBServiceTest} from '../_cacheDB'
import {FileDBService} from './fileDB.service'

export class FileDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static fileDBService = new FileDBService(CacheDBServiceTest.cacheDBService, FileDBServiceTest.dbService)
}
