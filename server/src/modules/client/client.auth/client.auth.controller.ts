import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
import {CheckJwtValidationGuard} from '@guard'
import {ClientAuthService} from './client.auth.service'

import * as HTTP from '@httpDataType'

@Controller('/client/auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  // POST AREA:

  @Post('/logIn')
  async logIn(@Body() data: HTTP.LogInDataType) {
    const {ok, body, gkdErrMsg, statusCode, jwtFromServer} = await this.clientAuthService.logIn(data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Post('/signUp')
  async signUp(@Body() data: HTTP.SignUpDataType) {
    const {ok, body, gkdErrMsg, statusCode, jwtFromServer} = await this.clientAuthService.signUp(data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/refreshToken')
  @UseGuards(CheckJwtValidationGuard)
  async refreshToken(@Headers() header: any) {
    const {jwtFromServer, jwtPayload} = header
    const {ok, body, gkdErrMsg, statusCode} = await this.clientAuthService.refreshToken(jwtPayload)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
