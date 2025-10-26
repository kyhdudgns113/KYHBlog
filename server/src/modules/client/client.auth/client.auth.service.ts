import {Injectable} from '@nestjs/common'
import {GKDJwtService} from '@modules/gkdJwt'
import {GKDLogService} from '@modules/gkdLog'
import {ClientAuthPortService} from '@modules/database'

import * as HTTP from '@httpDataType'
import * as U from '@util'
import * as T from '@type'

@Injectable()
export class ClientAuthService {
  constructor(
    private readonly loggerService: GKDLogService,
    private readonly portService: ClientAuthPortService,
    private readonly gkdJwtService: GKDJwtService
  ) {}

  // POST AREA:

  async logIn(data: HTTP.LogInDataType) {
    const where = `/client/auth/logIn`
    const {userId} = data

    try {
      // 1. 로그인 기능 수행 뙇!!
      const {user} = await this.portService.logIn(data)
      const {userName, userOId, signUpType} = user

      // 2. JWT 생성 뙇!!
      const jwtPayload: T.JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.gkdJwtService.signAsync(jwtPayload)

      // 3. 로그 기록 뙇!!
      const gkdLog = `로그인: ${userName}(${userId})`
      const gkdStatus = {userId, userOId, userName}
      this.loggerService.loggingMessage(where, gkdLog, userOId, gkdStatus)

      // 4. 성공 응답 뙇!!
      return {ok: true, body: {user}, gkdErrMsg: '', statusCode: 200, jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      this.loggerService.loggingError(where, errObj, '')
      return U.getFailResponse(errObj)
    }
  }

  async signUp(data: HTTP.SignUpDataType) {
    const where = `/client/auth/signUp`
    const {userId, userName} = data

    try {
      // 1. 회원가입 기능 수행 뙇!!
      const {user} = await this.portService.signUp(data)
      const {userOId, signUpType} = user

      // 2. JWT 생성 뙇!!
      const jwtPayload: T.JwtPayloadType = {
        userId,
        userName,
        userOId,
        signUpType
      }
      const {jwtFromServer} = await this.gkdJwtService.signAsync(jwtPayload)

      // 3. 성공 응답 뙇!!
      return {ok: true, body: {user}, gkdErrMsg: '', statusCode: 200, jwtFromServer}
      // ::
    } catch (errObj) {
      // ::
      this.loggerService.loggingError(where, errObj, '')
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async refreshToken(jwtPayload: T.JwtPayloadType) {
    /**
     * 이 함수는 토큰 재발급 안해도 된다.
     * - guard 가 알아서 재발급 해줌.
     * 해당 유저가 중간에 삭제되지는 않았나만 체크하고 유저 정보만 갱신해준다.
     */
    try {
      const {user} = await this.portService.refreshToken(jwtPayload)
      return {ok: true, body: {user}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
