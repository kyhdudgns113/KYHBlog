import {Module} from '@nestjs/common'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {CheckSocketJwtGuard} from '@guard'

import {SocketInfoService, SocketUserService, SocketChatService} from './services'
import {SocketGateway} from './socket.gateway'
import {SocketService} from './socket.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [],
  providers: [
    CheckSocketJwtGuard,
    SocketGateway, // ::
    SocketChatService,
    SocketInfoService,
    SocketUserService,
    SocketService
  ],
  exports: [SocketGateway, SocketInfoService, SocketUserService, SocketService, SocketChatService]
})
export class SocketModule {}
