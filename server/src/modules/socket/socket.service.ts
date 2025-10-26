import {Injectable} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {SocketInfoService, SocketUserService} from './services'

import * as T from '@type'

/**
 * SocketService
 *   - 다른 모듈에서 소켓을 사용할때 쓴다.
 */
@Injectable()
export class SocketService {
  constructor(
    private readonly gateway: SocketGateway,
    private readonly infoService: SocketInfoService,
    private readonly userService: SocketUserService
  ) {}

  async sendUserAlarm(alarm: T.AlarmType) {
    try {
      this.gateway.sendUserAlarm(alarm)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async sendUserAlarmRemoved(userOId: string, alarmOId: string) {
    try {
      this.gateway.sendUserAlarmRemoved(userOId, alarmOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async sendUserChatRoomCreated(userOId: string, chatRoom: T.ChatRoomType) {
    try {
      this.gateway.sendUserChatRoomCreated(userOId, chatRoom)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
