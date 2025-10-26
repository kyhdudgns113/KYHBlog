import {Module} from '@nestjs/common'
import {CommentDBService} from './commentDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [CommentDBService],
  exports: [CommentDBService]
})
export class CommentDBModule {}
