import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
import {ClientUserService} from './client.user.service'
import {CheckAdminGuard, CheckJwtValidationGuard} from '@guard'
import * as HTTP from '@httpDataType'

@Controller('/client/user')
export class ClientUserController {
  constructor(private readonly clientService: ClientUserService) {}

  // PUT AREA:

  @Put('/checkNewAlarm')
  @UseGuards(CheckJwtValidationGuard)
  async checkNewAlarm(@Headers() headers: any, @Body() data: HTTP.CheckNewAlarmType) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.checkNewAlarm(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:
  @Get('/loadAlarmArr/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadAlarmArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadAlarmArr(jwtPayload, userOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Get('/loadUserInfo/:userOId')
  async loadUserInfo(@Param('userOId') userOId: string) {
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadUserInfo(userOId)
    return {ok, body, gkdErrMsg, statusCode}
  }

  // DELETE AREA:

  @Delete('/removeAlarm/:alarmOId')
  @UseGuards(CheckJwtValidationGuard)
  async removeAlarm(@Headers() headers: any, @Param('alarmOId') alarmOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.removeAlarm(jwtPayload, alarmOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
