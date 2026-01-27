import {DBServiceTest} from '../__db'
import {CacheDBServiceTest} from '../_cacheDB'
import {DirectoryDBService} from './directoryDB.service'

export class DirectoryDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static directoryDBService = new DirectoryDBService(CacheDBServiceTest.cacheDBService, DirectoryDBServiceTest.dbService)
}
