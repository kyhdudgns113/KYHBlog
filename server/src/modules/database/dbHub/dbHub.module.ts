import {Module} from '@nestjs/common'
import {DBHubService} from './dbHub.service'

import * as TABLE from '../_tables'

@Module({
  imports: [
    TABLE.AlarmDBModule, // ::
    TABLE.ChatDBModule, // ::
    TABLE.CommentDBModule, // ::
    TABLE.DirectoryFileDBModule, // ::
    TABLE.LogDBModule, // ::
    TABLE.QnaDBModule,
    TABLE.UserDBModule,
  ],
  controllers: [],
  providers: [DBHubService],
  exports: [DBHubService],
})
export class DBHubModule {}
