import {Module} from '@nestjs/common'
import {WorkerPortService} from './workerPort.service'

import {DBHubModule} from '../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [WorkerPortService],
  exports: [WorkerPortService]
})
export class WorkerPortModule {}
