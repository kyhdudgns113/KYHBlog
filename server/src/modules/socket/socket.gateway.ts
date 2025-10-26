import {Server, Socket} from 'socket.io'
import {UseGuards} from '@nestjs/common'
import {SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets'

import {CheckSocketJwtGuard} from '@guard'
import {GKDJwtService} from '@modules/gkdJwt'
import {SendSocketClientMessage, SendSocketRoomMessage} from '@util'

import {SocketChatService, SocketUserService} from './services'

import * as T from '@type'
import * as S from '@socketType'

/**
 * SocketGateway
 *
 *   - 소켓메시지 송수신, 소켓서버 관리용으로 쓴다.
 */
@WebSocketGateway({cors: true})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: SocketChatService,
    private readonly jwtService: GKDJwtService,
    private readonly userService: SocketUserService
  ) {}

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]): any {
    // DO NOTHING:
  }
  handleDisconnect(client: Socket, ...args: any[]): any {
    // 해체작업 해줘야 한다.
    try {
      this.userService.userDisconnect(this.server, client)
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] handleDisconnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  // AREA1: GKDoubleJWT Validation Area

  @SubscribeMessage('request validation')
  @SendSocketClientMessage('response validation')
  async requestValidation(client: Socket, payload: S.SocketRequestValidationType) {
    try {
      const {ok, body, errObj} = await this.jwtService.requestValidationSocket(payload.jwtFromClient)

      if (ok) {
        const {jwtFromServer} = body
        const payload: S.SocketResponseValidationType = {jwtFromServer}
        return {client, payload}
      } // ::
      else {
        const jwtFromServer = ''
        const payload: S.SocketResponseValidationType = {jwtFromServer}

        console.log(`\n유저 소켓 토큰 인증중 에러 발생: ${errObj}`)
        Object.keys(errObj).forEach(key => {
          console.log(`   ${key}: ${errObj[key]}`)
        })

        return {client, payload}
      }
      // ::
    } catch (errObj) {
      // ::
      const jwtFromServer = ''
      const payload: S.SocketResponseValidationType = {jwtFromServer}

      console.log(`\n유저 소켓 토큰 인증중 치명적인 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })

      return {client, payload}
    }
  }

  // AREA2: User Service Area

  @SubscribeMessage('user connect')
  @UseGuards(CheckSocketJwtGuard)
  userConnect(client: Socket, payload: S.UserConnectType) {
    try {
      this.userService.userConnect(this.server, client, payload)
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] userConnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  // AREA3: Chat Service Area

  @SubscribeMessage('chat message')
  async chatMessage(client: Socket, payload: S.ChatMessageType) {
    try {
      const {chat, refreshs} = await this.chatService.chatMessage(this.server, client, payload)

      this.newChat(chat)
      Object.keys(refreshs).forEach(userOId => {
        this.refreshChatRoom(userOId, refreshs[userOId])
      })
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] chatMessage 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  @SubscribeMessage('chatRoom connect')
  @SendSocketRoomMessage('chatRoom opened')
  async chatRoomConnect(client: Socket, payload: S.ChatRoomConnectType) {
    const {userOId, chatRoomOId} = payload

    try {
      await this.chatService.chatRoomConnect(this.server, client, payload)

      const server = this.server
      const roomId = userOId
      const _payload: S.ChatRoomOpenedType = {chatRoomOId}

      return {server, roomId, payload: _payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] chatRoomConnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  @SubscribeMessage('chatRoom disconnect')
  async chatRoomDisconnect(client: Socket, payload: S.ChatRoomDisconnectType) {
    try {
      await this.chatService.chatRoomDisconnect(this.server, client, payload)
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] chatRoomDisconnect 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }

  // AREA4: Export Function Area

  getServer() {
    return this.server
  }

  @SendSocketRoomMessage('new alarm')
  sendUserAlarm(alarm: T.AlarmType) {
    try {
      const {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, senderUserName, senderUserOId, userOId} = alarm

      const server = this.server
      const roomId = userOId
      const payload: S.NewAlarmType = {
        alarmOId,
        alarmStatus,
        alarmType,
        content,
        createdAt,
        fileOId,
        senderUserName,
        senderUserOId,
        userOId
      }
      return {server, roomId, payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] sendUserAlarm 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      throw errObj
    }
  }

  @SendSocketRoomMessage('remove alarm')
  sendUserAlarmRemoved(userOId: string, alarmOId: string) {
    try {
      const server = this.server
      const roomId = userOId
      const payload: S.UserAlarmRemovedType = {alarmOId}
      return {server, roomId, payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] sendUserAlarmRemoved 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      throw errObj
    }
  }

  @SendSocketRoomMessage('new chat room')
  sendUserChatRoomCreated(userOId: string, chatRoom: T.ChatRoomType) {
    try {
      const server = this.server
      const roomId = userOId

      const {chatRoomOId, chatRoomName, targetUserId, targetUserMail, targetUserName, targetUserOId, unreadMessageCount, lastChatDate} = chatRoom

      const payload: S.NewChatRoomCreatedType = {
        chatRoomOId,
        chatRoomName,
        targetUserId,
        targetUserMail,
        targetUserName,
        targetUserOId,
        unreadMessageCount,
        lastChatDate
      }
      return {server, roomId, payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] sendUserChatRoomCreated 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      throw errObj
    }
  }

  // AREA5: Private Function Area

  @SendSocketRoomMessage('new chat')
  newChat(chat: T.ChatType) {
    try {
      const server = this.server
      const roomId = chat.chatRoomOId
      const payload: S.NewChatType = chat
      return {server, roomId, payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] newChat 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      throw errObj
    }
  }

  @SendSocketRoomMessage('refresh chat room')
  refreshChatRoom(userOId: string, refresh: S.RefreshChatRoomType) {
    try {
      const server = this.server
      const roomId = userOId
      const payload: S.RefreshChatRoomType = refresh
      return {server, roomId, payload}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[SocketGateway] refreshChatRoom 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      throw errObj
    }
  }
}
