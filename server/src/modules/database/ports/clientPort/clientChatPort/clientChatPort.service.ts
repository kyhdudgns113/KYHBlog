import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'
import {GKDLockService} from '@modules/gkdLock'
import {adminUserId} from '@secret'

import * as DTO from '@dto'
import * as SV from '@shareValue'
import * as T from '@type'

@Injectable()
export class ClientChatPortService {
  constructor(
    private readonly dbHubService: DBHubService,
    private readonly gkdLockService: GKDLockService
  ) {}

  // GET AREA:

  /**
   * loadChatArr
   *  - chatRoomOId 채팅방의 채팅 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatArr: 채팅 배열
   */
  async loadChatArr(jwtPayload: T.JwtPayloadType, chatRoomOId: string, firstIdx: number) {
    const where = `/client/chat/loadChatArr`

    let lockString: string = ''
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_ChatRoom(where, jwtPayload, chatRoomOId)

      // 2. 채팅 배열 락 뙇!!
      lockString = await this.gkdLockService.readyLock(chatRoomOId)

      // 3. 채팅 배열 조회 뙇!!
      const {chatArr} = await this.dbHubService.readChatArrByChatRoomOId(where, chatRoomOId, firstIdx)

      // 4. 리턴 뙇!!
      return {chatArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.gkdLockService.releaseLock(lockString)
    }
  }

  /**
   * loadChatRoomArr
   *  - userOId 유저의 채팅방 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatRoomArr: 채팅방 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 채팅방 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   */
  async loadChatRoomArr(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = `/client/chat/loadChatRoomArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 채팅방 배열 조회 뙇!!
      const {chatRoomArr} = await this.dbHubService.readChatRoomArrByUserOId(where, userOId)

      // 3. 리턴 뙇!!
      return {chatRoomArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadUserChatRoom
   *  - userOId 유저의 targetUserOId 유저와의 채팅방을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatRoomOId: 채팅방 아이디
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 나 자신과의 채팅방은 만들수도, 가져올수도 없다.
   *  3. 채팅방 생성 락 뙇!!
   *  4. 채팅방 조회 뙇!!
   *  5. 존재하지 않으면 생성 뙇!!
   *  6. 리턴 뙇!!
   *
   *  finally. 락 해제 뙇!!
   */
  async loadUserChatRoom(jwtPayload: T.JwtPayloadType, userOId: string, targetUserOId: string) {
    const where = `/client/chat/loadUserChatRoom`

    let lockString: string = ''

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 자신과의 채팅방을 시도하려는지 췍!!
      if (userOId === targetUserOId) {
        throw {
          gkd: {sameUser: `같은 유저와의 채팅방은 만들수도, 가져올수도 없다.`},
          gkdErrCode: 'CLIENTCHATPORT_loadUserChatRoom_sameUser',
          gkdErrMsg: `나와의 채팅방은 만들수도, 가져올수도 없습니다.`,
          gkdStatus: {userOId, targetUserOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. 채팅방 생성 락 뙇!!
      lockString = await this.gkdLockService.readyLock(`createChatRoom`)

      // 4. 채팅방 조회 뙇!!
      const {chatRoom} = await this.dbHubService.readChatRoomByBothOId(where, userOId, targetUserOId)

      // 5. 존재하지 않으면 생성 뙇!!
      if (!chatRoom) {
        const dto: DTO.CreateChatRoomDTO = {
          userOId,
          targetUserOId
        }
        const {chatRoom} = await this.dbHubService.createChatRoom(where, dto)
        return {chatRoom, isCreated: true}
      }

      // 6. 리턴 뙇!!
      return {chatRoom, isCreated: false}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.gkdLockService.releaseLock(lockString)
    }
  }

  /**
   * loadAdminChatRoom
   *  - userOId 유저의 관리자와의 채팅방을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - chatRoomOId: 채팅방 아이디
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 관리자 userOId 조회 뙇!!
   *  3. 관리자가 시도하는지 췍!!
   *  4. 채팅방 생성 락 뙇!!
   *  5. 채팅방 조회 뙇!!
   *  6. 존재하지 않으면 생성 뙇!!
   *  7. 리턴 뙇!!
   *
   *  finally. 락 해제 뙇!!
   */
  async loadAdminChatRoom(jwtPayload: T.JwtPayloadType, userOId: string) {
    const where = `/client/chat/loadAdminChatRoom`

    let lockString: string = ''

    try {
      // 1. 권한 췍!!
      const {user} = await this.dbHubService.checkAuth_User(where, jwtPayload, userOId)

      // 2. 관리자 userOId 조회 뙇!!
      const {user: adminUser} = await this.dbHubService.readUserByUserId(where, adminUserId)

      if (!adminUser) {
        throw {
          gkd: {noAdmin: `관리자 유저를 찾을 수 없습니다.`},
          gkdErrCode: 'CLIENTCHATPORT_loadAdminChatRoom_noAdmin',
          gkdErrMsg: `관리자 유저를 찾을 수 없습니다.`,
          gkdStatus: {adminUserId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const adminUserOId = adminUser.userOId

      // 3. 관리자가 시도하는지 췍!!
      if (user.userAuth !== SV.AUTH_ADMIN) {
        throw {
          gkd: {noAdmin: `관리자는 이런거 하지 마세요. 뭔가 잘못됐어요.`},
          gkdErrCode: 'CLIENTCHATPORT_loadAdminChatRoom_noAdmin',
          gkdErrMsg: `관리자는 이런거 하지 마세요. 뭔가 잘못됐어요.`,
          gkdStatus: {userOId, userAuth: user.userAuth},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 4. 채팅방 생성 락 뙇!!
      lockString = await this.gkdLockService.readyLock(`createChatRoom`)

      // 5. 채팅방 조회 뙇!!
      const {chatRoom} = await this.dbHubService.readChatRoomByBothOId(where, userOId, adminUserOId)

      // 6. 존재하지 않으면 생성 뙇!!
      if (!chatRoom) {
        const dto: DTO.CreateChatRoomDTO = {
          userOId,
          targetUserOId: adminUserOId
        }
        const {chatRoom} = await this.dbHubService.createChatRoom(where, dto)
        return {chatRoom, isCreated: true}
      }

      // 7. 리턴 뙇!!
      return {chatRoom, isCreated: false}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.gkdLockService.releaseLock(lockString)
    }
  }
}
