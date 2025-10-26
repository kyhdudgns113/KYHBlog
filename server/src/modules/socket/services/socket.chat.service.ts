import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {SocketInfoService} from './socket.info.service'
import {SocketPortService} from '@modules/database'

import * as S from '@socketType'
import * as T from '@type'

@Injectable()
export class SocketChatService {
  constructor(
    private readonly infoService: SocketInfoService,
    private readonly portService: SocketPortService
  ) {}

  async chatMessage(server: Server, client: Socket, payload: S.ChatMessageType) {
    const {chatRoomOId, content} = payload
    try {
      const {chatSocketsArr} = this.infoService.getChatRoomSockets(server, chatRoomOId)

      const userOId = this.infoService.readSocketsUserOId(client)

      const lookingUserOIds = {}
      chatSocketsArr.forEach(socket => {
        const userOId = this.infoService.readSocketsUserOId(socket)
        lookingUserOIds[userOId] = true
      })

      const lookingUserOIdArr = Object.keys(lookingUserOIds)

      const {chat, refreshs} = await this.portService.chatMessage(chatRoomOId, userOId, content, lookingUserOIdArr)

      return {chat, refreshs}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async chatRoomConnect(server: Server, socket: Socket, payload: S.ChatRoomConnectType) {
    const {userOId, chatRoomOId} = payload

    /**
     * 1. 이 소켓이 해당 유저인지 확인
     * 2. 해당 유저가 채팅방에 속한 유저인지 확인
     * 3. 소켓을 채팅방에 참여시키고, 안 읽은 메시지 갯수를 0으로 초기화 뙇!!
     */
    try {
      // 1. 이 소켓이 해당 유저인지 확인
      const isSameUser = this.infoService.readSocketsUserOId(socket) === userOId
      if (!isSameUser) {
        throw {
          gkd: {noUser: `유저가 다름`},
          gkdErrCode: 'SocketChatService_chatRoomConnect_noUser',
          gkdErrMsg: `유저가 다릅니다.`,
          gkdStatus: {userOId, chatRoomOId},
          statusCode: 400,
          where: 'chatRoomConnect'
        } as T.ErrorObjType
      }

      // 2. 해당 유저가 채팅방에 속한 유저인지 확인
      const isUserInChatRoom = await this.portService.isUserInChatRoom(userOId, chatRoomOId)
      if (!isUserInChatRoom) {
        throw {
          gkd: {noUser: `유저가 채팅방에 참여중이지 않음`},
          gkdErrCode: 'SocketChatService_chatRoomConnect_noUserInChatRoom',
          gkdErrMsg: `유저가 채팅방에 참여중이지 않습니다.`,
          gkdStatus: {userOId, chatRoomOId},
          statusCode: 400,
          where: 'chatRoomConnect'
        } as T.ErrorObjType
      }

      // 3. 소켓을 채팅방에 참여시키고, 안 읽은 메시지 갯수를 0으로 초기화 뙇!!
      await Promise.all([
        this.infoService.joinSocketToChatRoom(socket, chatRoomOId),
        this.portService.chatRoomOpened(userOId, chatRoomOId) // ::
      ])
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async chatRoomDisconnect(server: Server, socket: Socket, payload: S.ChatRoomDisconnectType) {
    try {
      await this.infoService.leaveSocketFromChatRoom(server, socket, payload.chatRoomOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
