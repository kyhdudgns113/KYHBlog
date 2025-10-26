import {Module} from '@nestjs/common'

import {CheckAdminGuard} from '@guard'
import {DatabaseModule} from '@modules/database'
import {GKDJwtModule} from '@modules/gkdJwt'

import {ClientAdminController} from './client.admin.controller'
import {ClientAdminService} from './client.admin.service'

@Module({
  imports: [DatabaseModule, GKDJwtModule],
  controllers: [ClientAdminController],
  providers: [CheckAdminGuard, ClientAdminService],
  exports: [ClientAdminService]
})
export class ClientAdminModule {}
