import {Module} from '@nestjs/common'
import {SocketPortService} from './socketPort.service'

import {DBHubModule} from '../../dbHub'
import {GKDLockModule} from '@modules/gkdLock'

@Module({
  imports: [DBHubModule, GKDLockModule],
  controllers: [],
  providers: [SocketPortService],
  exports: [SocketPortService]
})
export class SocketPortModule {}
