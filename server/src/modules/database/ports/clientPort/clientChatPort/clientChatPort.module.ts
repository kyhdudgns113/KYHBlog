import {Module} from '@nestjs/common'
import {ClientChatPortService} from './clientChatPort.service'

import {DBHubModule} from '../../../dbHub'
import {GKDLockModule, GKDLockService} from '@modules/gkdLock'

@Module({
  imports: [DBHubModule, GKDLockModule],
  controllers: [],
  providers: [ClientChatPortService, GKDLockService],
  exports: [ClientChatPortService]
})
export class ClientChatPortModule {}
