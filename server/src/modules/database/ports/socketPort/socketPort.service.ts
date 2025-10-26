import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'
import {GKDLockService} from '@modules/gkdLock'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'
import * as U from '@util'
import * as V from '@value'

@Injectable()
export class SocketPortService {
  constructor(
    private readonly dbHubService: DBHubService,
    private readonly lockService: GKDLockService
  ) {}

  /**
   * chatMessage
   *
   * 기능
   *   - 채팅 메시지를 생성한다.
   *   - 채팅방의 마지막 채팅 날짜를 업데이트 한다.
   *   - 안 읽은 유저는 안 읽은 메시지 개수를 증가시킨다.
   *
   * ------
   *
   * 리턴
   *   - chat: 채팅 메시지
   *   - refreshs: {key: 안 읽은 유저 OId, value: 채팅방 갱신 정보} 의 객체
   *
   * ------
   *
   * 순서
   *
   *   1. 권한 췍!!
   *   2. 채팅방 락 뙇!!
   *   3. 채팅방 현재 메시지 갯수 및 안 읽은 메시지 갯수 조회 뙇!!
   *     - 전체 참여 유저들에 대한 refreshs를이 때 받아온다.
   *   4. 채팅 메시지 생성 뙇!!
   *     - 여기서 업데이트 날짜 갱신한다.
   *   5. 채팅방의 메시지 갯수 및 마지막 메시지 날짜 업데이트 뙇!!
   *   6. refreshs 에서 읽은 유저들을 제거한다.
   *   7. 안 읽은 유저는 안 읽은 메시지 갯수를 증가시킨다.
   *   8. refreshs 의 unreadMessageCount 를 1 증가한다.
   *   9. 리턴 뙇!!
   */
  async chatMessage(chatRoomOId: string, userOId: string, content: string, lookingUserOIdArr: string[]) {
    const where = '/socketPort/chatMessage'

    let lockString: string = ''

    try {
      // 1. 권한 췍!!
      const jwtPayload: T.JwtPayloadType = {
        signUpType: 'common',
        userId: '',
        userName: '',
        userOId
      }
      const {user} = await this.dbHubService.checkAuth_ChatRoom(where, jwtPayload, chatRoomOId)

      // 2. 채팅방 락 뙇!!
      lockString = await this.lockService.readyLock(chatRoomOId)

      // 3. 채팅방 현재 메시지 갯수 및 안 읽은 메시지 갯수 조회 뙇!!
      const {numChat, refreshs} = await this.dbHubService.readChatRoomInfo(where, chatRoomOId)

      // 4. 채팅 메시지 생성 뙇!!
      const createdAt = new Date()
      const dto: DTO.CreateChatDTO = {
        chatIdx: numChat,
        chatRoomOId,
        content,
        createdAt,
        userOId,
        userName: user.userName
      }
      const {chat} = await this.dbHubService.createChat(where, dto)

      // 5. 채팅방의 메시지 갯수 및 마지막 메시지 날짜 업데이트 뙇!!
      await this.dbHubService.updateChatRoomLast(where, chatRoomOId, createdAt)

      // 6. refreshs 에서 읽은 유저들을 제거한다.
      lookingUserOIdArr.forEach(userOId => {
        delete refreshs[userOId]
      })

      const unreadUserOIdArr = Object.keys(refreshs)

      // 7. 안 읽은 유저는 안 읽은 메시지 갯수를 증가시킨다.
      // 8. refreshs 의 unreadMessageCount 를 1 증가한다.
      if (unreadUserOIdArr.length > 0) {
        await this.dbHubService.updateChatRoomUnreadCntIncrease(where, chatRoomOId, unreadUserOIdArr)
        unreadUserOIdArr.forEach(userOId => {
          refreshs[userOId].unreadMessageCount++
        })
      }

      // 9. 리턴 뙇!!
      return {chat, refreshs}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      this.lockService.releaseLock(lockString)
    }
  }

  /**
   * chatRoomOpened
   *
   * 기능
   *   - 채팅방을 열었을 때, 안 읽은 메시지 갯수를 0으로 초기화한다.
   *
   * ------
   *
   * 순서
   *   1. 채팅방 안 읽은 메시지 갯수를 0으로 초기화 뙇!!
   *
   * ------
   *
   * 설명
   *   1. socket.chat.service 에서 권한을 이미 체크했다
   *     - 권한을 또 체크하지는 않는다.
   *   2. 안 읽은 메시지의 무결성을 굳이 체크해야할 필요는 없다.
   *     - 어차피 안 읽은 갯수만 넘겨준다.
   *     - Mutex Lock 획득, 해제에 쓰이는 오버헤드가 더 크다.
   */
  async chatRoomOpened(userOId: string, chatRoomOId: string) {
    const where = '/socketPort/chatRoomOpened'
    try {
      await this.dbHubService.updateChatRoomUnreadCntZero(where, chatRoomOId, [userOId])
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async isUserInChatRoom(userOId: string, chatRoomOId: string) {
    const where = '/socketPort/isUserInChatRoom'
    try {
      const jwtPayload: T.JwtPayloadType = {
        signUpType: 'common',
        userId: '',
        userName: '',
        userOId
      }
      await this.dbHubService.checkAuth_ChatRoom(where, jwtPayload, chatRoomOId)

      return true
      // ::
    } catch (errObj) {
      // ::
      return false
    }
  }
}
