/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {AUTH_USER} from '@secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {ClientAuthPortServiceTest} from '@modules/database'
import {USER_NAME_LENGTH_MAX} from '@shareValue'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 5

/**
 * 잘못된 이름을 받았을때를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. 이름 확안: 짧은거
 *   2. 이름 확안: 긴거
 *   3. 이름 확인: 중복
 */
export class WrongName extends GKDTestBase {
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
      await this.memberFail(this._1_TryShortName.bind(this), db, logLevel)
      await this.memberFail(this._2_TryLongName.bind(this), db, logLevel)
      await this.memberFail(this._3_TryDuplicateName.bind(this), db, logLevel)
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

  private async _1_TryShortName(db: mysql.Pool, logLevel: number) {
    try {
      const userName = 'a'
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-4') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_TryLongName(db: mysql.Pool, logLevel: number) {
    try {
      const userName = 'a'.repeat(USER_NAME_LENGTH_MAX + 1)
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'AUTH_signUp_1-4') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_TryDuplicateName(db: mysql.Pool, logLevel: number) {
    try {
      const {user: _user} = this.testDB.getUserCommon(AUTH_USER)

      const userName = _user.userName
      const userId = this.constructor.name
      const userMail = this.constructor.name + '@d.d'
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'USERDB_createUser_1062') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongName(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
