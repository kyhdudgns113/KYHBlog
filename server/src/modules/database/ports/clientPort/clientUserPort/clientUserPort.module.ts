import {Module} from '@nestjs/common'
import {ClientUserPortService} from './clientUserPort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientUserPortService],
  exports: [ClientUserPortService]
})
export class ClientUserPortModule {}
