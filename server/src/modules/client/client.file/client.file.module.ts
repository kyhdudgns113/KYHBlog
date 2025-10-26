import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {SocketModule, SocketService} from '@modules/socket'

import {ClientFileController} from './client.file.controller'
import {ClientFileService} from './client.file.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientFileController],
  providers: [CheckAdminGuard, ClientFileService, SocketService],
  exports: [ClientFileService]
})
export class ClientFileModule {}
