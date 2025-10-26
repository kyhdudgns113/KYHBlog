import {Module} from '@nestjs/common'
import {ClientFilePortService} from './clientFilePort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientFilePortService],
  exports: [ClientFilePortService]
})
export class ClientFilePortModule {}
