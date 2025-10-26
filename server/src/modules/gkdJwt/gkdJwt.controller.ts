import {Body, Controller, Get, Headers, Request} from '@nestjs/common'
import {GKDJwtService} from './gkdJwt.service'

@Controller('gkdJwt')
export class GKDJwtController {
  constructor(private readonly gkdJwtService: GKDJwtService) {}

  @Get('/requestValidation')
  async requestValidation(@Headers() headers: any) {
    const ret = await this.gkdJwtService.requestValidation(headers)
    return ret
  }
}
