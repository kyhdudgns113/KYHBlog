import {Module} from '@nestjs/common'
import {LogDBService} from './logDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [LogDBService],
  exports: [LogDBService]
})
export class LogDBModule {}
