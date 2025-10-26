import {Module} from '@nestjs/common'
import {ChatDBService} from './chatDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [ChatDBService],
  exports: [ChatDBService]
})
export class ChatDBModule {}
