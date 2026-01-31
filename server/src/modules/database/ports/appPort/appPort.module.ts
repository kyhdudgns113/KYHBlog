import {Module} from '@nestjs/common'
import {AppPortService} from './appPort.service'

import {DBHubModule} from '../../dbHub'
import {CacheDBModule} from '../../_tables/_cacheDB'

@Module({
  imports: [DBHubModule, CacheDBModule],
  controllers: [],
  providers: [AppPortService],
  exports: [AppPortService],
})
export class AppPortModule {}
