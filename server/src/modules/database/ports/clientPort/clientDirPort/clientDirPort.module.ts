import {Module} from '@nestjs/common'
import {ClientDirPortService} from './clientDirPort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientDirPortService],
  exports: [ClientDirPortService]
})
export class ClientDirPortModule {}
