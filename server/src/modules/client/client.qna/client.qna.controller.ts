import {Body, Controller, Headers, Post, UseGuards} from '@nestjs/common'
import {ClientQnaService} from './client.qna.service'
import {CheckJwtValidationGuard} from '@guard'

import * as HTTP from '@httpDataType'

@Controller('/client/qna')
export class ClientQnaController {
  constructor(private readonly clientService: ClientQnaService) {}

  // POST AREA:

  @Post('/addQnAFile')
  @UseGuards(CheckJwtValidationGuard)
  async addQnAFile(@Headers() headers: any, @Body() data: HTTP.AddQnAType) {
    /**
     * 입력
     *   - userOId
     *   - title
     *   - content
     *   - isPrivate
     *
     * 기능
     *   - QnA 추가
     *
     * 출력
     *   - qnAArr
     *     - 전체 QnA 배열 (최신순, 사용자의 QnA만)
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addQnAFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}

