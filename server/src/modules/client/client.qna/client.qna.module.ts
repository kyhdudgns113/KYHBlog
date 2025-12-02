import {Module} from '@nestjs/common'

import {CheckJwtValidationGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'

import {ClientQnaController} from './client.qna.controller'
import {ClientQnaService} from './client.qna.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientQnaController],
  providers: [CheckJwtValidationGuard, ClientQnaService],
  exports: [ClientQnaService]
})
export class ClientQnaModule {}

