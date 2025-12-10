import {Module} from '@nestjs/common'

import {CheckJwtValidationGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {SocketModule, SocketService} from '@modules/socket'

import {ClientQnaController} from './client.qna.controller'
import {ClientQnaService} from './client.qna.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule, SocketModule],
  controllers: [ClientQnaController],
  providers: [CheckJwtValidationGuard, ClientQnaService, SocketService],
  exports: [ClientQnaService]
})
export class ClientQnaModule {}
