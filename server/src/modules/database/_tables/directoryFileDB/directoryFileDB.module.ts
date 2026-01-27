import {Module} from '@nestjs/common'
import {DirectoryFileDBService} from './directoryFileDB.service'

import {DBModule} from '../__db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [DirectoryFileDBService],
  exports: [DirectoryFileDBService],
})
export class DirectoryFileDBModule {}
