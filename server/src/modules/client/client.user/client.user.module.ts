import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'

import {ClientUserController} from './client.user.controller'
import {ClientUserService} from './client.user.service'
import {SocketModule} from '@modules/socket'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientUserController],
  providers: [CheckAdminGuard, ClientUserService],
  exports: [ClientUserService]
})
export class ClientUserModule {}
