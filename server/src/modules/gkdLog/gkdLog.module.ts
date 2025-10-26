import {Module} from '@nestjs/common'
import {GKDLogService} from './gkdLog.service'
import {DatabaseModule} from '@modules/database'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [GKDLogService],
  exports: [GKDLogService]
})
export class GKDLogModule {}
