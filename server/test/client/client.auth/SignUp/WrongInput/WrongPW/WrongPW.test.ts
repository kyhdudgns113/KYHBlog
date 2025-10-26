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
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * 잘못된 비밀번호를 받았을때를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. 비밀번호 확인: 짧은거
 *   2. 비밀번호 확인: 긴거
 *   3. 비밀번호 확인: 소문자 없음
 *   4. 비밀번호 확인: 대문자 없음
 *   5. 비밀번호 확인: 숫자 없음
 *   6. 비밀번호 확인: 특수문자 없음
 */
export class WrongPW extends GKDTestBase {
  private portService = ClientAuthPortServiceTest.clientAuthPortService

  private userOId: string = null

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_TryShortPW.bind(this), db, logLevel)
      await this.memberFail(this._2_TryLongPW.bind(this), db, logLevel)
      await this.memberFail(this._3_TryNoLowerPW.bind(this), db, logLevel)
      await this.memberFail(this._4_TryNoUpperPW.bind(this), db, logLevel)
      await this.memberFail(this._5_TryNoNumberPW.bind(this), db, logLevel)
      await this.memberFail(this._6_TryNoSpecialCharPW.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()
    try {
      if (this.userOId) {
        const query = `DELETE FROM users WHERE userOId = ?`
        await connection.execute(query, [this.userOId])
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  private async _1_TryShortPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'Abcd1!f'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-6') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_TryLongPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'Abcd1!fAbcd1!fAbcd1!f'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-6') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_TryNoLowerPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'ABCD1!FFD'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-7') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _4_TryNoUpperPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'abcdefg1!'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-7') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _5_TryNoNumberPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'AbCdEfG!!'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-7') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _6_TryNoSpecialCharPW(db: mysql.Pool, logLevel: number) {
    try {
      const password = 'ABcdEFgH123'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const userName = 'userName'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-7') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongPW(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
