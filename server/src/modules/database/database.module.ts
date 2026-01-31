import {Module} from '@nestjs/common'
import {DBHubModule} from './dbHub'
import {GKDLockService} from '@modules/gkdLock'

import * as P from './ports'

@Module({
  imports: [
    DBHubModule, // ::

    P.AppPortModule,
    P.ClientPortModule,
    P.JwtPortModule,
    P.LoggerPortModule,
    P.SocketPortModule,
    P.WorkerPortModule
  ],
  controllers: [],
  providers: [
    P.AppPortService,

    P.ClientAdminPortService,
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientQnaPortService,
    P.ClientUserPortService,

    P.JwtPortService,
    P.LoggerPortService,
    P.SocketPortService,
    P.WorkerPortService,

    GKDLockService
  ],
  exports: [
    P.AppPortService,

    P.ClientAdminPortService,
    P.ClientAuthPortService, // ::
    P.ClientChatPortService,
    P.ClientDirPortService,
    P.ClientFilePortService,
    P.ClientQnaPortService,
    P.ClientUserPortService,

    P.JwtPortService,
    P.LoggerPortService,
    P.SocketPortService,
    P.WorkerPortService
  ]
})
export class DatabaseModule {}
