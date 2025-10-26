import {Module} from '@nestjs/common'
import {DBHubModule} from './dbHub'
import {GKDLockService} from '@modules/gkdLock'

import * as P from './ports'

@Module({
  imports: [
    DBHubModule, // ::

    P.ClientPortModule,
    P.JwtPortModule,
    P.LoggerPortModule,
    P.SocketPortModule,
    P.WorkerPortModule
  ],
  controllers: [],
  providers: [
    P.ClientAdminPortService,
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientUserPortService,

    P.JwtPortService,
    P.LoggerPortService,
    P.SocketPortService,
    P.WorkerPortService,

    GKDLockService
  ],
  exports: [
    P.ClientAdminPortService,
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientUserPortService,

    P.JwtPortService,
    P.LoggerPortService,
    P.SocketPortService,
    P.WorkerPortService
  ]
})
export class DatabaseModule {}
