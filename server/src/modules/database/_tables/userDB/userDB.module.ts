import {Module} from '@nestjs/common'
import {UserDBService} from './userDB.service'

import {DBModule} from '../__db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [UserDBService],
  exports: [UserDBService],
})
export class UserDBModule {}
