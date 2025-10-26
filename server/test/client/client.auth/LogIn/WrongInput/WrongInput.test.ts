/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {AUTH_ADMIN} from '@secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {ClientAuthPortServiceTest} from '@modules/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력들을 받았을때를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. 있는 아이디, 잘못된 비밀번호
 *   2. 있는 아이디, 남의 비밀번호
 *   3. 없는 아이디
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientAuthPortServiceTest.clientAuthPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_WrongPassword.bind(this), db, logLevel)
      await this.memberFail(this._2_OtherPassword.bind(this), db, logLevel)
      await this.memberFail(this._3_WrongUserId.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }

  private async _1_WrongPassword(db: mysql.Pool, logLevel: number) {
    try {
      const {user} = this.testDB.getUserCommon(AUTH_ADMIN)

      const {userId} = user
      const password = 'WrongPassword1!'

      const data: HTTP.LogInDataType = {userId, password}

      await this.portService.logIn(data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_logIn_3') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_OtherPassword(db: mysql.Pool, logLevel: number) {
    try {
      const {user} = this.testDB.getUserCommon(AUTH_ADMIN)

      const {userId} = user
      const password = 'authUserPassword1!'

      const data: HTTP.LogInDataType = {userId, password}

      await this.portService.logIn(data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_logIn_3') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _3_WrongUserId(db: mysql.Pool, logLevel: number) {
    try {
      const userId = 'WrongUserId'
      const password = 'WrongPassword1!'

      const data: HTTP.LogInDataType = {userId, password}

      await this.portService.logIn(data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_logIn_3') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongInput(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
