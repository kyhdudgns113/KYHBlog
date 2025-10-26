import {Module} from '@nestjs/common'
import {LoggerPortService} from './loggerPort.service'

import {DBHubModule} from '../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [LoggerPortService],
  exports: [LoggerPortService]
})
export class LoggerPortModule {}
