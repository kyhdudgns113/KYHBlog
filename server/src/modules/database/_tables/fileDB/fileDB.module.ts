import {Module} from '@nestjs/common'
import {FileDBService} from './fileDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [FileDBService],
  exports: [FileDBService]
})
export class FileDBModule {}
