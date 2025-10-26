import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'
import {USER_NAME_LENGTH_MAX} from '@value'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'

@Injectable()
export class ClientAuthPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  /**
   * 1. 입력값 췍!!
   *  1-1. userId 길이 체크
   *  1-2. userId 형식 체크 (알파벳 대소문자, 숫자, 언더바)
   *  1-3. password 길이 체크
   *  1-4. password 형식 체크
   *
   * 2. DB 에서 유저정보 조회 뙇!!
   * 3. 로그인 실패했으면 에러 뙇!!
   * 4. 유저 마지막 활동 업데이트 뙇!! (await 할 필요 없다.)
   * 4. 리턴 뙇!!
   */
  async logIn(data: HTTP.LogInDataType) {
    const where = `/client/auth/logIn`

    const {userId, password} = data

    try {
      // 1-1. 입력값 체크: userId 길이
      if (!userId || userId.length < 6 || userId.length > 20) {
        throw {
          gkd: {userId: `userId 길이 오류. ${userId.length}가 들어옴`},
          gkdErrCode: 'AUTH_logIn_1-1',
          gkdErrMsg: `userId 는 6자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-2. 입력값 체크: userId 형식(알파벳 대소문자, 숫자, 언더바)
      if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
        throw {
          gkd: {userId: `userId 형식 오류`},
          gkdErrCode: 'AUTH_logIn_1-2',
          gkdErrMsg: `userId 는 영문 대소문자, 숫자, 언더바(_)만 포함할 수 있습니다.`,
          gkdStatus: {userId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-3. 입력값 체크: password 길이
      if (!password || password.length < 8 || password.length > 20) {
        throw {
          gkd: {password: `password 길이 오류. ${password.length}가 들어옴`},
          gkdErrCode: 'AUTH_logIn_1-3',
          gkdErrMsg: `password 는 8자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-4. 입력값 체크: password 형식
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/.test(password)) {
        throw {
          gkd: {password: `password 형식 오류`},
          gkdErrCode: 'AUTH_logIn_1-4',
          gkdErrMsg: `password 는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.`,
          gkdStatus: {userId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2. DB 에서 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserIdAndPassword(where, userId, password)

      // 3. 로그인 실패했으면 에러 뙇!!
      if (!user) {
        throw {
          gkd: {logIn: `로그인 실패`},
          gkdErrCode: 'AUTH_logIn_3',
          gkdErrMsg: `아이디 또는 비밀번호가 일치하지 않습니다.`,
          gkdStatus: {userId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 4. 유저 마지막 활동 업데이트 뙇!! (await 할 필요 없다.)
      const {userOId} = user
      const updatedAt = new Date()
      this.dbHubService.updateUserUpdatedAt(where, userOId, updatedAt)

      // 5. 리턴 뙇!!
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async signUp(data: HTTP.SignUpDataType) {
    const where = `/client/auth/signUp`
    /**
     * 1. 입력값 췍!!
     *  1-1. userId 길이 체크
     *  1-2. userId 형식 체크
     *  1-3. userMail 길이 및 형식 체크
     *  1-4. userName 길이 체크
     *  1-5. userName 형식 체크
     *  1-6. password 길이 체크
     *  1-7. password 형식 체크
     *
     * 2. dto 생성 뙇!!
     * 3. DB 에 추가 뙇!!
     * 4. 리턴 뙇!!
     */
    try {
      const {userId, userMail, userName, password} = data

      // 1-1. 입력값 체크: userId 길이
      if (!userId || userId.length < 6 || userId.length > 20) {
        throw {
          gkd: {userId: `userId 길이 오류. ${userId.length}가 들어옴`},
          gkdErrCode: 'AUTH_signUp_1-1',
          gkdErrMsg: `userId 는 6자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-2. 입력값 체크: userId 형식(알파벳 대소문자, 숫자, 언더바)
      if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
        throw {
          gkd: {userId: `userId 형식 오류`},
          gkdErrCode: 'AUTH_signUp_1-2',
          gkdErrMsg: `userId 는 영문 대소문자, 숫자, 언더바(_)만 포함할 수 있습니다.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-3. 입력값 체크: userMail
      if (!userMail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(userMail)) {
        throw {
          gkd: {userMail: `userMail 형식 오류`},
          gkdErrCode: 'AUTH_signUp_1-3',
          gkdErrMsg: `userMail 는 이메일 형식이어야 합니다.`,
          gkdStatus: {userId, userMail},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-4. 입력값 체크: userName 길이
      if (!userName || userName.length < 2 || userName.length > USER_NAME_LENGTH_MAX) {
        throw {
          gkd: {userName: `userName 길이 오류. ${userName.length}가 들어옴`},
          gkdErrCode: 'AUTH_signUp_1-4',
          gkdErrMsg: `userName 는 2자 이상 ${USER_NAME_LENGTH_MAX}자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-5. 입력값 체크: userName 형식(한글, 영문 대소문자, 숫자, 언더바)
      if (!/^[가-힣a-zA-Z0-9_]+$/.test(userName)) {
        throw {
          gkd: {userName: `userName 형식 오류`},
          gkdErrCode: 'AUTH_signUp_1-5',
          gkdErrMsg: `userName 는 한글, 영문 대소문자, 숫자, 언더바(_)만 포함할 수 있습니다.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-6. 입력값 체크: password 길이
      if (!password || password.length < 8 || password.length > 20) {
        throw {
          gkd: {password: `password 길이 오류. ${password.length}가 들어옴`},
          gkdErrCode: 'AUTH_signUp_1-6',
          gkdErrMsg: `password 는 8자 이상 20자 이하여야 합니다.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 1-7. 입력값 체크: password 형식
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/.test(password)) {
        throw {
          gkd: {password: `password 형식 오류`},
          gkdErrCode: 'AUTH_signUp_1-7',
          gkdErrMsg: `password 는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.`,
          gkdStatus: {userId, userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2. dto 생성 뙇!!
      const dto: DTO.SignUpDTO = {
        userId,
        userMail,
        userName,
        password,
        picture: null,
        signUpType: 'common'
      }

      // 3. DB 에 추가 뙇!!
      const {user} = await this.dbHubService.createUser(where, dto)

      // 4. 리턴 뙇!!
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async refreshToken(jwtPayload: T.JwtPayloadType) {
    const where = `/client/auth/refreshToken`
    const {userId, userName, userOId} = jwtPayload

    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {userErr: `유저가 DB 에 없음`},
          gkdErrCode: 'AUTH_refreshToken',
          gkdErrMsg: `유저 정보 조회 실패`,
          gkdStatus: {userId, userName, userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 유저 마지막 활동 업데이트 뙇!! (await 할 필요 없다.)
      const updatedAt = new Date()
      this.dbHubService.updateUserUpdatedAt(where, userOId, updatedAt)

      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
