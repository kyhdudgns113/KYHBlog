import {DBServiceTest} from '../__db'
import {CacheDBService} from './cacheDB.service'

export class CacheDBServiceTest {
  private static dbService = DBServiceTest.dbService

  public static cacheDBService = new CacheDBService(CacheDBServiceTest.dbService)
}
