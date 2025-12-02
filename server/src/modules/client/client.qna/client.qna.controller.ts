import {Body, Controller, Get, Headers, Param, Post, UseGuards} from '@nestjs/common'
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

  // GET AREA:

  @Get('/getQnA/:qnAOId')
  @UseGuards(CheckJwtValidationGuard)
  async getQnA(@Headers() headers: any, @Param('qnAOId') qnAOId: string) {
    /**
     * 입력
     *   - qnAOId (URL 파라미터)
     *
     * 기능
     *   - qnAOId로 QnA를 조회한다
     *   - 비공개 질문글이면 당사자나 관리자만 읽을 수 있음
     *   - 비공개 질문글이 아니면 유저 권한만 있으면 볼 수 있음
     *   - 조회수 증가
     *
     * 출력
     *   - qnA
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.getQnA(jwtPayload, qnAOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}

