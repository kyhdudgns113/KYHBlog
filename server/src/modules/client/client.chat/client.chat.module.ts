import {Module} from '@nestjs/common'
import {ClientChatController} from './client.chat.controller'
import {ClientChatService} from './client.chat.service'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {CheckJwtValidationGuard} from '@guard'
import {SocketModule} from '@modules/socket'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientChatController],
  providers: [CheckJwtValidationGuard, ClientChatService],
  exports: [ClientChatService]
})
export class ClientChatModule {}
