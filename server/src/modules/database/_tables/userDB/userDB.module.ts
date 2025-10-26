import {Module} from '@nestjs/common'
import {UserDBService} from './userDB.service'

import {DBModule} from '../_db'

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [UserDBService],
  exports: [UserDBService]
})
export class UserDBModule {}
