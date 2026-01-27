import {Module} from '@nestjs/common'
import {QnaDBService} from './qnaDB.service'

import {DBModule} from '../__db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [QnaDBService],
  exports: [QnaDBService],
})
export class QnaDBModule {}
