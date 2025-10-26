import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'

@Injectable()
export class SocketInfoService {
  constructor() {}
  /**
   * 유저가 보유한 메인소켓 리스트는 저장할 필요가 없다.
   * room 으로 관리하면 된다.
   */

  /**
   * socketsUOId[sockId] = uOId
   */
  private socketsUserOId: Record<string, string> = {}

  // AREA1: Sockets Area
  getSocketsUserOIdsArr(socketIds: string[]) {
    try {
      const userOIdsSet = new Set(socketIds.map(socketId => this.socketsUserOId[socketId]))
      const userOIdsArr = Array.from(userOIdsSet)
      return {userOIdsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async joinSocketToChatRoom(client: Socket, chatRoomOId: string) {
    try {
      await client.join(chatRoomOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async joinSocketToUser(client: Socket, userOId: string) {
    try {
      this.socketsUserOId[client.id] = userOId
      await client.join(userOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async leaveSocketFromChatRoom(server: Server, client: Socket, chatRoomOId: string) {
    try {
      await client.leave(chatRoomOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  leaveSocketFromUser(client: Socket) {
    try {
      if (this.socketsUserOId[client.id]) {
        delete this.socketsUserOId[client.id]
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  readSocketsUserOId(client: Socket) {
    try {
      return this.socketsUserOId[client.id]
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA2: Others Area
  /**
   * chatRoomOId 의 소켓들의 정보를 리턴한다.
   */
  getChatRoomSockets(server: Server, chatRoomOId: string) {
    try {
      const sockets = server.sockets.adapter.rooms.get(chatRoomOId)
      if (!sockets) {
        return {chatSocketsArr: []}
      }
      const chatSocketsArr = Array.from(sockets).map(socketId => server.sockets.sockets.get(socketId))
      return {chatSocketsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  /**
   * userOId 의 소켓들을 배열 형태로 리턴한다.
   */
  getMainSockets(server: Server, userOId: string) {
    try {
      const sockets = server.sockets.adapter.rooms.get(userOId)
      if (!sockets) {
        return {mainSocketsArr: []}
      }
      const mainSocketsArr = Array.from(sockets).map(socketId => server.sockets.sockets.get(socketId))
      return {mainSocketsArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
