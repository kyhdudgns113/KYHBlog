import {Module} from '@nestjs/common'
import {FileDBService} from './fileDB.service'

import {DBModule} from '../__db'
import {CacheDBModule} from '../_cacheDB'

@Module({
  imports: [CacheDBModule, DBModule],
  controllers: [],
  providers: [FileDBService],
  exports: [FileDBService],
})
export class FileDBModule {}
