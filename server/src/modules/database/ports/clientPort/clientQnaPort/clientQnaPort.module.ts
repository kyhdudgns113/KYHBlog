import {Module} from '@nestjs/common'
import {ClientQnaPortService} from './clientQnaPort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientQnaPortService],
  exports: [ClientQnaPortService]
})
export class ClientQnaPortModule {}

