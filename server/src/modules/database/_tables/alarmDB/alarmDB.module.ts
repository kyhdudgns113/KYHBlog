import {Module} from '@nestjs/common'
import {AlarmDBService} from './alarmDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [AlarmDBService],
  exports: [AlarmDBService]
})
export class AlarmDBModule {}
