import {Module} from '@nestjs/common'
import {ClientAuthPortService} from './clientAuthPort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientAuthPortService],
  exports: [ClientAuthPortService]
})
export class ClientAuthPortModule {}
