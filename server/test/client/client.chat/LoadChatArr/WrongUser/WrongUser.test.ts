/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'

import {ClientChatPortServiceTest} from '@modules/database'
import {AUTH_ADMIN, AUTH_USER} from '@commons/secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 유저일 때를 테스트한다.
 *   - 채팅방 유저가 아니고, 관리자도 아닌 유저가 시도하는 경우를 테스트한다.
 *   - 서브 테스트가 없으므로 testFail 로 실행한다.
 */
export class WrongUser extends GKDTestBase {
  private portService = ClientChatPortServiceTest.clientChatPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_root} = this.testDB.getUserCommon(AUTH_ADMIN).user
      const {userOId: userOId_user_1} = this.testDB.getUserCommon(AUTH_USER, 1).user

      const {chatRoomOId} = this.testDB.getChatRoomOId(userOId_root, userOId_user_1)

      await this.portService.loadChatArr(jwtPayload, chatRoomOId, 0)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuth_ChatRoom_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
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
  const testModule = new WrongUser(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testFail(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
