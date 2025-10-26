import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from '@guard'
import {ClientChatService} from './client.chat.service'

@Controller('/client/chat')
export class ClientChatController {
  constructor(private readonly clientService: ClientChatService) {}

  // GET AREA:

  @Get('/loadChatArr/:chatRoomOId/:firstIdx')
  @UseGuards(CheckJwtValidationGuard)
  async loadChatArr(@Headers() headers: any, @Param('chatRoomOId') chatRoomOId: string, @Param('firstIdx') firstIdxStr: string) {
    const {jwtFromServer, jwtPayload} = headers
    const firstIdx = parseInt(firstIdxStr)
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadChatArr(jwtPayload, chatRoomOId, firstIdx)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Get('/loadChatRoomArr/:userOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadChatRoomArr(@Headers() headers: any, @Param('userOId') userOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadChatRoomArr(jwtPayload, userOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Get('/loadUserChatRoom/:userOId/:targetUserOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadUserChatRoom(@Headers() headers: any, @Param('userOId') userOId: string, @Param('targetUserOId') targetUserOId: string) {
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadUserChatRoom(jwtPayload, userOId, targetUserOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
