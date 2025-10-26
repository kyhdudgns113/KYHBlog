import {Injectable} from '@nestjs/common'
import {Server, Socket} from 'socket.io'
import {SocketInfoService} from './socket.info.service'
import * as S from '@socketType'

@Injectable()
export class SocketUserService {
  constructor(private readonly infoService: SocketInfoService) {}

  userConnect(server: Server, socket: Socket, payload: S.UserConnectType) {
    try {
      this.infoService.joinSocketToUser(socket, payload.userOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  userDisconnect(server: Server, socket: Socket) {
    try {
      this.infoService.leaveSocketFromUser(socket)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
