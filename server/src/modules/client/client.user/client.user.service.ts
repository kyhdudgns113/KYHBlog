import {Injectable} from '@nestjs/common'
import {ClientUserPortService} from '@modules/database'
import {SocketService} from '@modules/socket'
import {JwtPayloadType} from '@type'

import * as HTTP from '@httpDataType'
import * as U from '@util'

@Injectable()
export class ClientUserService {
  constructor(
    private readonly portService: ClientUserPortService,
    private readonly socketService: SocketService
  ) {}

  // PUT AREA:

  async checkNewAlarm(jwtPayload: JwtPayloadType, data: HTTP.CheckNewAlarmType) {
    try {
      await this.portService.checkNewAlarm(jwtPayload, data)
      return {ok: true, body: {}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadAlarmArr(jwtPayload: JwtPayloadType, userOId: string) {
    try {
      const {alarmArr} = await this.portService.loadAlarmArr(jwtPayload, userOId)
      return {ok: true, body: {alarmArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadUserInfo(userOId: string) {
    try {
      const {user} = await this.portService.loadUserInfo(userOId)
      return {ok: true, body: {user}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // DELETE AREA:

  async removeAlarm(jwtPayload: JwtPayloadType, alarmOId: string) {
    try {
      // 1. 알람을 지운다.
      const {alarmArr} = await this.portService.removeAlarm(jwtPayload, alarmOId)

      // 2. 알람을 지운 사용자에게 알람을 지운 사실을 알린다.
      this.socketService.sendUserAlarmRemoved(jwtPayload.userOId, alarmOId)

      // 3. 리턴한다.
      return {ok: true, body: {alarmArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
