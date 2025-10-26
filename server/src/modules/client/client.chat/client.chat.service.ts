import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '@type'
import {ClientChatPortService} from '@modules/database'
import {SocketService} from '@modules/socket'

import * as U from '@util'

@Injectable()
export class ClientChatService {
  constructor(
    private readonly portService: ClientChatPortService,
    private readonly socketService: SocketService
  ) {}

  // GET AREA:

  async loadChatArr(jwtPayload: JwtPayloadType, chatRoomOId: string, firstIdx: number) {
    try {
      const {chatArr} = await this.portService.loadChatArr(jwtPayload, chatRoomOId, firstIdx)
      return {ok: true, body: {chatArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadChatRoomArr(jwtPayload: JwtPayloadType, userOId: string) {
    try {
      const {chatRoomArr} = await this.portService.loadChatRoomArr(jwtPayload, userOId)
      return {ok: true, body: {chatRoomArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadUserChatRoom(jwtPayload: JwtPayloadType, userOId: string, targetUserOId: string) {
    try {
      const {chatRoom, isCreated} = await this.portService.loadUserChatRoom(jwtPayload, userOId, targetUserOId)

      if (isCreated) {
        // Payload 유저와 userOId 와 다를 수 있다.
        this.socketService.sendUserChatRoomCreated(jwtPayload.userOId, chatRoom)
      }

      return {ok: true, body: {chatRoom}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
