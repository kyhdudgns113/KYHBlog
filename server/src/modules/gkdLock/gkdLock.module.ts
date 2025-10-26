import {Module} from '@nestjs/common'
import {GKDLockService} from './gkdLock.service'

@Module({
  imports: [],
  controllers: [],
  providers: [GKDLockService],
  exports: [GKDLockService]
})
export class GKDLockModule {}
