import {Module} from '@nestjs/common'
import {ServeStaticModule} from '@nestjs/serve-static'
import {join} from 'path'
import {AppController} from './app.controller'

import * as M from './modules'

@Module({
  imports: [
    M.ClientModule, // ::
    M.DatabaseModule,
    M.GKDJwtModule,
    M.GKDLockModule,
    M.GKDLogModule,
    M.SocketModule,
    M.WorkerModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static_files'),
      serveRoot: '/static_files'
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
