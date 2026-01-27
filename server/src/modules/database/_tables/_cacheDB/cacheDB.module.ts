import {Module} from '@nestjs/common'
import {CacheDBService} from './cacheDB.service'

import {DBModule} from '../__db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [CacheDBService],
  exports: [CacheDBService],
})
export class CacheDBModule {}
