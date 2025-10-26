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
 *   - 유저 정보를 잘 읽어오나 테스트한다.
 */
export class SuccessCases extends GKDTestBase {
  private portService = ClientAuthPortServiceTest.clientAuthPortService

  private userOId: string = null

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    /**
     * 다음 정보들이 잘 들어왔나 테스트한다.
     * 1. userId
     * 2. userName
     * 3. userAuth
     */
    try {
      const userId = this.constructor.name
      const userName = 'userName'
      const userMail = 'name@name.name'
      const password = 'testPassword1!'

      const data: HTTP.SignUpDataType = {userId, userMail, userName, password}

      const {user} = await this.portService.signUp(data)

      this.userOId = user.userOId

      // 1. userId
      if (userId !== user.userId) {
        throw `userId 가 ${userId} 가 아닌 ${user.userId} 로 들어왔다.`
      }
      // 2. userName
      if (userName !== user.userName) {
        throw `userName 가 ${userName} 가 아닌 ${user.userName} 로 들어왔다.`
      }
      // 3. userAuth
      if (user.userAuth !== AUTH_USER) {
        throw `userAuth 가 ${AUTH_USER} 가 아닌 ${user.userAuth} 로 들어왔다.`
      }
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
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new SuccessCases(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
