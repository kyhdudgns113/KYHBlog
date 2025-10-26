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
 * WrongInput
 *   - ClientChatPort 의 loadUserChatRoom 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 서브 테스트
 *   1. userOId 와 targetOId 가 같을때
 *   2. 존재하지 않는 userOId 일때
 *   3. 존재하지 않는 targetUserOId 일때
 */
export class WrongInput extends GKDTestBase {
  private readonly portService = ClientChatPortServiceTest.clientChatPortService

  private chatRoomOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_User0_try_to_User0_ChatRoom.bind(this), db, logLevel)
      await this.memberFail(this._2_User0_try_to_NotExistUser_ChatRoom.bind(this), db, logLevel)
      await this.memberFail(this._3_User0_try_to_NotExistTargetUser_ChatRoom.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await db.getConnection()
    try {
      const {chatRoomOId} = this

      if (chatRoomOId) {
        const query = `DELETE FROM chatRoomRouters WHERE chatRoomOId = ?`
        const param = [chatRoomOId]
        await connection.execute(query, param)
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

  private async _1_User0_try_to_User0_ChatRoom(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_0, userOId_user_0)
      this.chatRoomOId = chatRoom.chatRoomOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTCHATPORT_loadUserChatRoom_sameUser') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_User0_try_to_NotExistUser_ChatRoom(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_ADMIN, 0).user

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, '123456781234567812345678', userOId_user_0)
      this.chatRoomOId = chatRoom.chatRoomOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CHATDB_createChatRoom_1452') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_User0_try_to_NotExistTargetUser_ChatRoom(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_0, '123456781234567812345678')
      this.chatRoomOId = chatRoom.chatRoomOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CHATDB_createChatRoom_1452') {
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
