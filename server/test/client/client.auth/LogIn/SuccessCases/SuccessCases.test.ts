/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {AUTH_ADMIN, AUTH_USER} from '@secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {ClientAuthPortServiceTest} from '@modules/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 성공해야 하는 경우들을 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. AUTH_ADMIN 유저 테스트
 *   2. AUTH_USER 유저 테스트
 */
export class SuccessCases extends GKDTestBase {
  private portService = ClientAuthPortServiceTest.clientAuthPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_TryUserAuthAdmin.bind(this), db, logLevel)
      await this.memberOK(this._2_TryUserAuthUser.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }

  private async _1_TryUserAuthAdmin(db: mysql.Pool, logLevel: number) {
    /**
     * 관리자 유저로 로그인이 성공하는지 확인한다.
     *
     * 다음 값들이 제대로 들어오는지 확인한다.
     * 1. 권한값
     * 2. 유저 아이디
     * 3. 유저 이름
     * 4. 유저 OID
     */
    try {
      const {user: _user} = this.testDB.getUserCommon(AUTH_ADMIN)

      const {userId: _userId} = _user
      const password = 'authRootPassword1!'

      const data: HTTP.LogInDataType = {userId: _userId, password}

      const {user} = await this.portService.logIn(data)

      // 1. 권한값 확인
      if (user.userAuth !== AUTH_ADMIN) {
        throw `1. 권한값이 왜 ${AUTH_ADMIN} 이 아니라 ${user.userAuth} 일까?`
      }

      // 2. 유저 아이디 확인
      if (user.userId !== _userId) {
        throw `2. 유저 아이디가 왜 ${_userId} 이 아니라 ${user.userId} 일까?`
      }

      // 3. 유저 이름 확인
      if (user.userName !== _user.userName) {
        throw `3. 유저 이름이 왜 ${_user.userName} 이 아니라 ${user.userName} 일까?`
      }

      // 4. 유저 OID 확인
      if (user.userOId !== _user.userOId) {
        throw `4. 유저 OID가 왜 ${_user.userOId} 이 아니라 ${user.userOId} 일까?`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_TryUserAuthUser(db: mysql.Pool, logLevel: number) {
    /**
     * 일반 유저로 로그인이 성공하는지 확인한다.
     *
     * 다음 값들이 제대로 들어오는지 확인한다.
     * 1. 권한값
     * 2. 유저 아이디
     * 3. 유저 이름
     * 4. 유저 OID
     */
    try {
      const {user: _user} = this.testDB.getUserCommon(AUTH_USER)

      const {userId: _userId} = _user
      const password = 'authUserPassword1!'

      const data: HTTP.LogInDataType = {userId: _userId, password}

      const {user} = await this.portService.logIn(data)

      // 1. 권한값 확인
      if (user.userAuth !== AUTH_USER) {
        throw `1. 권한값이 왜 ${AUTH_USER} 이 아니라 ${user.userAuth} 일까?`
      }

      // 2. 유저 아이디 확인
      if (user.userId !== _userId) {
        throw `2. 유저 아이디가 왜 ${_userId} 이 아니라 ${user.userId} 일까?`
      }

      // 3. 유저 이름 확인
      if (user.userName !== _user.userName) {
        throw `3. 유저 이름이 왜 ${_user.userName} 이 아니라 ${user.userName} 일까?`
      }

      // 4. 유저 OID 확인
      if (user.userOId !== _user.userOId) {
        throw `4. 유저 OID가 왜 ${_user.userOId} 이 아니라 ${user.userOId} 일까?`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new SuccessCases(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
