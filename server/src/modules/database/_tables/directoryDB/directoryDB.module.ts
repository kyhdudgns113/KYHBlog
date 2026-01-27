import {Module} from '@nestjs/common'
import {DirectoryDBService} from './directoryDB.service'

import {DBModule} from '../__db'
import {CacheDBModule} from '../_cacheDB'

@Module({
  imports: [CacheDBModule, DBModule],
  controllers: [],
  providers: [DirectoryDBService],
  exports: [DirectoryDBService],
})
export class DirectoryDBModule {}
