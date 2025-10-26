/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {AUTH_ADMIN, AUTH_USER} from '@commons/secret'
import {ClientChatPortServiceTest} from '@modules/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * Working
 *   - ClientChatPort 의 loadChatRoomArr 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 서브 테스트
 *   1. 유저가 본인의 채팅방 목록을 확인하려는 경우
 *   2. 관리자가 유저의 채팅방 목록을 확인하려는 경우
 */
export class Working extends GKDTestBase {
  private readonly portService = ClientChatPortServiceTest.clientChatPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_User0_try_to_User0.bind(this), db, logLevel)
      await this.memberOK(this._2_Admin_try_to_User0.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {}

  private async _1_User0_try_to_User0(db: mysql.Pool, logLevel: number) {
    /**
     * 일반 유저가 자신의 채팅방 목록을 불러오는 경우이다.
     *
     * 점검사항
     *   1. 채팅방 배열이 3개인가? (root, user_1, user_banned)
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_user_0} = jwtPayload

      const {chatRoomArr} = await this.portService.loadChatRoomArr(jwtPayload, userOId_user_0)

      // 1. 채팅방 배열이 3개인가? (root, user_1, user_banned)
      if (chatRoomArr.length !== 3) {
        throw `1. 채팅방 배열이 3개가 아닌 ${chatRoomArr.length} 개이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_Admin_try_to_User0(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user

      const {chatRoomArr} = await this.portService.loadChatRoomArr(jwtPayload, userOId_user_0)

      // 1. 채팅방 배열이 3개인가? (root, user_1, user_banned)
      if (chatRoomArr.length !== 3) {
        throw `1. 채팅방 배열이 3개가 아닌 ${chatRoomArr.length} 개이다.`
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
  const testModule = new Working(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
