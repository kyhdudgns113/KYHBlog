import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'

import {ClientDirectoryController} from './client.directory.controller'
import {ClientDirectoryService} from './client.directory.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientDirectoryController],
  providers: [CheckAdminGuard, ClientDirectoryService],
  exports: [ClientDirectoryService]
})
export class ClientDirectoryModule {}
