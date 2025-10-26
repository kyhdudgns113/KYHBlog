import {Module} from '@nestjs/common'

import {ClientAdminModule} from './client.admin'
import {ClientAuthModule} from './client.auth'
import {ClientChatModule} from './client.chat'
import {ClientDirectoryModule} from './client.directory'
import {ClientFileModule} from './client.file'
import {ClientUserModule} from './client.user'
@Module({
  imports: [
    ClientAdminModule,
    ClientAuthModule, // ::
    ClientChatModule,
    ClientDirectoryModule,
    ClientFileModule,
    ClientUserModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ClientModule {}
