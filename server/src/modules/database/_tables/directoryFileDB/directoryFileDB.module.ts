import {Module} from '@nestjs/common'
import {DirectoryFileDBService} from './directoryFileDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [DirectoryFileDBService],
  exports: [DirectoryFileDBService]
})
export class DirectoryFileDBModule {}
