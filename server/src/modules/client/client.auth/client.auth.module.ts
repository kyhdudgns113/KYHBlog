import {Module} from '@nestjs/common'

import {CheckJwtValidationGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'
import {GKDLogModule} from '@modules/gkdLog'

import {ClientAuthController} from './client.auth.controller'
import {ClientAuthService} from './client.auth.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule, GKDLogModule],
  controllers: [ClientAuthController],
  providers: [CheckJwtValidationGuard, ClientAuthService],
  exports: [ClientAuthService]
})
export class ClientAuthModule {}
