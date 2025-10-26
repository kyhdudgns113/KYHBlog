import {Module} from '@nestjs/common'
import {ClientAdminPortService} from './clientAdminPort.service'

import {DBHubModule} from '../../../dbHub'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [ClientAdminPortService],
  exports: [ClientAdminPortService]
})
export class ClientAdminPortModule {}
