import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {GKDJwtService} from '@modules/gkdJwt'
import {decodeJwtFromClient, getJwtFromHeader, jwtHeaderLenVali} from '@secret'
import {JwtPayloadType} from '@type'

@Injectable()
export class CheckJwtValidationGuard implements CanActivate {
  constructor(private readonly jwtService: GKDJwtService) {}

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
        // console.log(`좌 : ${this.jwtService.checkUOIdToHeaderToUrl(uOId, header)}`)
        // console.log(`우 : ${url}`)
        return false // Header 검증 실패
      }

      // 권한값 받아오기
      // 토큰인증에서 DB 로딩 안하려고 폐지
      // const {userAuth} = await this.portService.readUserAuthByUserId(userId)

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
      headers.url = url
      // headers.userAuth = userAuth // 토큰인증에서 DB 로딩 안하려고 폐지

      // Jwt 인증 성공 시 true 반환
      return true
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n  CheckJwtValidationGuard: ${errObj}`)
      if (typeof errObj !== 'string') {
        Object.keys(errObj).forEach(key => {
          console.log(`  ${key}: ${errObj[key]}`)
        })
      }
      return false
    }
  }
}
