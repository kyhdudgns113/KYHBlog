import {Module} from '@nestjs/common'
import {CopyMeController} from './CopyMe.controller'
import {CopyMeService} from './CopyMe.service'

@Module({
  imports: [],
  controllers: [CopyMeController],
  providers: [CopyMeService],
  exports: [CopyMeService]
})
export class CopyMeModule {}
