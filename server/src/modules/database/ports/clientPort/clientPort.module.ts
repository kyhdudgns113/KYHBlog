import {Module} from '@nestjs/common'

import {ClientAdminPortModule, ClientAdminPortService} from './clientAdminPort'
import {ClientAuthPortModule, ClientAuthPortService} from './clientAuthPort'
import {ClientChatPortModule, ClientChatPortService} from './clientChatPort'
import {ClientDirPortModule, ClientDirPortService} from './clientDirPort'
import {ClientFilePortModule, ClientFilePortService} from './clientFilePort'
import {ClientUserPortModule, ClientUserPortService} from './clientUserPort'
import {DBHubModule} from '../../dbHub'
import {GKDLockService} from '@modules/gkdLock'

@Module({
  imports: [
    ClientAdminPortModule,
    ClientAuthPortModule, // ::
    ClientChatPortModule,
    ClientDirPortModule,
    ClientFilePortModule,
    ClientUserPortModule,
    DBHubModule
  ],
  controllers: [],
  providers: [
    ClientAdminPortService,
    ClientAuthPortService, // ::
    ClientChatPortService,
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService,
    GKDLockService
  ],
  exports: [
    ClientAdminPortService,
    ClientAuthPortService, // ::
    ClientChatPortService,
    ClientDirPortService,
    ClientFilePortService,
    ClientUserPortService
  ]
})
export class ClientPortModule {}
