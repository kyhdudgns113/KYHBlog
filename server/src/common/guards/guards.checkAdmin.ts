import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {decodeJwtFromClient, getJwtFromHeader, jwtHeaderLenVali} from '@secret'
import {JwtPayloadType} from '@type'
import {GKDJwtService} from '@modules/gkdJwt'
import {JwtPortService} from '@modules/database'

@Injectable()
export class CheckAdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: GKDJwtService,
    private readonly portService: JwtPortService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const headers = request.headers
      const url = request.url
      const {jwtFromClient} = getJwtFromHeader(headers)
      const {header} = decodeJwtFromClient(jwtFromClient, jwtHeaderLenVali)
      const extractedPayload = await this.jwtService.verifyAsync(jwtFromClient, jwtHeaderLenVali)

      const {userId, userName, userOId, signUpType} = extractedPayload

      if (!url) {
        return false
      }

      if (this.jwtService.checkUOIdToHeaderToUrl(userOId, header) !== url) {
        return false // Header 검증 실패
      }

      // 관리자인지 췍!!
      await this.portService.checkUserAdmin(userOId)

      this.jwtService.resetUOIdToHeaderToUrl(userOId, header)

      // 새로운 JWT 생성
      const jwtPayload: JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.jwtService.signAsync(jwtPayload)

      headers.jwtFromServer = jwtFromServer
      headers.jwtFromClient = jwtFromClient
      headers.jwtPayload = jwtPayload

      // Jwt 인증 성공 시 true 반환
      return true
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n  CheckAdminGuard: ${errObj}`)
      if (typeof errObj !== 'string') {
        Object.keys(errObj).forEach(key => {
          console.log(`    ${key}: ${errObj[key]}`)
        })
      }
      return false
    }
  }
}
