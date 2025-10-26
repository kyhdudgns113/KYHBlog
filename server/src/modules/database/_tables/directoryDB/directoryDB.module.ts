import {Module} from '@nestjs/common'
import {DirectoryDBService} from './directoryDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [DirectoryDBService],
  exports: [DirectoryDBService]
})
export class DirectoryDBModule {}
