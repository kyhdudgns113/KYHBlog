/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientChatPortServiceTest} from '@modules/database'
import {AUTH_USER} from '@secret'

import * as mysql from 'mysql2/promise'
import * as TV from '@testValue'
import {JwtPayloadType} from '@type'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - ClientChatPort 의 loadUserChatRoom 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 새 유저를 하나 만든다.
 *
 * 서브 테스트
 *   1. 기존에 있는 채팅방 읽는지 테스트
 *   2. 새로운 채팅방 생성하는지 테스트
 *   3. 새로 생겼던 채팅방 읽는지 테스트
 */
export class WorkingScenario extends GKDTestBase {
  private readonly portService = ClientChatPortServiceTest.clientChatPortService

  private userOId_user_new: string = ''
  private chatRoomOId_new: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const userOId_user_new = '100000000000000000000005'
      const userId_user_new = 'commonUserNew'
      const userName_user_new = 'commonUserNew'
      const userMail_user_new = 'userNew@user.user'
      const createdAt_user_new = new Date()
      const updatedAt_user_new = new Date()
      const hashedPassword_user_new = `yesYes1!23`
      const signUpType_user_new = 'common'

      const queryUser = `INSERT INTO users (userOId, userId, userName, userMail, createdAt, updatedAt, hashedPassword, signUpType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      const paramsUser = [
        userOId_user_new,
        userId_user_new,
        userName_user_new,
        userMail_user_new,
        createdAt_user_new,
        updatedAt_user_new,
        hashedPassword_user_new,
        signUpType_user_new
      ]
      await db.execute(queryUser, paramsUser)

      this.userOId_user_new = userOId_user_new
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_ReadExistingChatRoom.bind(this), db, logLevel)
      await this.memberOK(this._2_CreateNewChatRoom.bind(this), db, logLevel)
      await this.memberOK(this._3_ReadChatRoomCreatedByMe.bind(this), db, logLevel)
      await this.memberOK(this._4_ReadChatRoomCreatedByOther.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()

    try {
      if (this.chatRoomOId_new) {
        const queryChatRoomRouter = `DELETE FROM chatRoomRouters WHERE chatRoomOId = ?`
        const paramChatRoomRouter = [this.chatRoomOId_new]
        await connection.execute(queryChatRoomRouter, paramChatRoomRouter)

        const queryChatRoom = `DELETE FROM chatRooms WHERE chatRoomOId = ?`
        const paramChatRoom = [this.chatRoomOId_new]
        await connection.execute(queryChatRoom, paramChatRoom)
      }
      if (this.userOId_user_new) {
        const queryUser = `DELETE FROM users WHERE userOId = ?`
        const paramUser = [this.userOId_user_new]
        await connection.execute(queryUser, paramUser)
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

  private async _1_ReadExistingChatRoom(db: mysql.Pool, logLevel: number) {
    /**
     * 기존에 있는 채팅방을 읽는 경우이다.
     *   - 0번째 유저가 1번째 유저와의 채팅방을 읽어온다.
     *
     * 점검사항
     *   1. 채팅방 OId 가 제대로 들어왔는지만 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)

      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user
      const {userOId: userOId_user_1} = this.testDB.getUserCommon(AUTH_USER, 1).user

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_0, userOId_user_1)

      // 1. 채팅방 OId 가 제대로 들어왔는지만 확인한다.
      if (chatRoom.chatRoomOId !== TV.chatRoomOId_0_1) {
        throw `1. 채팅방 OId 가 ${TV.chatRoomOId_0_1} 가 아니라 ${chatRoom.chatRoomOId} 가 들어옴`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_CreateNewChatRoom(db: mysql.Pool, logLevel: number) {
    /**
     * 새로운 채팅방을 생성하는 경우이다.
     *   - 0번째 유저가 새로운 유저와의 채팅방을 생성한다.
     *
     * 점검사항
     *   1. targetUserOId 가 제대로 들어왔는지 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user
      const {userOId_user_new} = this

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_0, userOId_user_new)

      this.chatRoomOId_new = chatRoom.chatRoomOId

      // 1. targetUserOId 가 제대로 들어왔는지 확인한다.
      if (chatRoom.targetUserOId !== userOId_user_new) {
        throw `1. targetUserOId 가 ${userOId_user_new} 가 아니라 ${chatRoom.targetUserOId} 가 들어옴`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_ReadChatRoomCreatedByMe(db: mysql.Pool, logLevel: number) {
    /**
     * 이전에 내가 만들었던 채팅방을 제대로 읽어오는지 테스트
     *   - 0번째 유저가 이전에 만들었던 채팅방을 읽어온다.
     *
     * 점검사항
     *   1. 채팅방 OId 가 제대로 들어왔는지만 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER, 0)
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user
      const {chatRoomOId_new, userOId_user_new} = this

      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_0, userOId_user_new)

      // 1. 채팅방 OId 가 제대로 들어왔는지만 확인한다.
      if (chatRoom.chatRoomOId !== chatRoomOId_new) {
        throw `1. 채팅방 OId 가 ${chatRoomOId_new} 가 아니라 ${chatRoom.chatRoomOId} 가 들어옴`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_ReadChatRoomCreatedByOther(db: mysql.Pool, logLevel: number) {
    /**
     * 다른 유저가 만들었던 나와의 채팅방은 읽어오는지 테스트
     *   - 새 유저가 0번째 유저와의 채팅방을 읽어온다.
     *
     * 점검사항
     *   1. 채팅방 OId 를 확인한다.
     *   2. targetUserOId 를 확인한다.
     */
    try {
      const jwtPayload: JwtPayloadType = {
        signUpType: 'common',
        userOId: this.userOId_user_new,
        userName: 'commonUserNew',
        userId: 'commonUserNew'
      }
      const {userOId: userOId_user_0} = this.testDB.getUserCommon(AUTH_USER, 0).user
      const {chatRoomOId_new, userOId_user_new} = this
      const {chatRoom} = await this.portService.loadUserChatRoom(jwtPayload, userOId_user_new, userOId_user_0)

      // 1. 채팅방 OId 를 확인한다.
      if (chatRoom.chatRoomOId !== chatRoomOId_new) {
        throw `1. 채팅방 OId 가 ${chatRoomOId_new} 가 아니다 ${chatRoom.chatRoomOId} 가 들어옴`
      }
      // 2. targetUserOId 를 확인한다.
      if (chatRoom.targetUserOId !== userOId_user_0) {
        throw `2. targetUserOId 가 ${userOId_user_0} 가 아니라 ${chatRoom.targetUserOId} 가 들어옴`
      }
      // ::

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
  const testModule = new WorkingScenario(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
