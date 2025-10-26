import {Module} from '@nestjs/common'
import {DBHubModule} from '../../dbHub'
import {JwtPortService} from './jwtPort.service'

@Module({
  imports: [DBHubModule],
  controllers: [],
  providers: [JwtPortService],
  exports: [JwtPortService]
})
export class JwtPortModule {}
