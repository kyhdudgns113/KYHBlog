import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {GKDJwtService} from '@modules/gkdJwt'
import {jwtHeaderLenVali} from '@secret'

@Injectable()
export class CheckSocketJwtGuard implements CanActivate {
  constructor(private readonly jwtService: GKDJwtService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const payload = context.switchToWs().getData()
      if (!payload.jwtFromClient) {
        console.log(`  SocketJwtGuard: jwtFromClient 없음`)
        return false
      }
      const {jwtFromClient} = payload
      await this.jwtService.verifyAsync(jwtFromClient, jwtHeaderLenVali)

      return true
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n  CheckSocketJwtGuard: ${errObj}`)
      if (typeof errObj !== 'string') {
        Object.keys(errObj).forEach(key => {
          console.log(`    ${key}: ${errObj[key]}`)
        })
      }
      return false
    }
  }
}
