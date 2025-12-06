import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards} from '@nestjs/common'
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
     *   - qnAOId
     *     - 생성된 QnA의 오브젝트 아이디
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addQnAFile(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Post('/addQnAComment')
  @UseGuards(CheckJwtValidationGuard)
  async addQnAComment(@Headers() headers: any, @Body() data: HTTP.AddQnACommentType) {
    /**
     * 입력
     *   - qnAOId
     *   - userOId
     *   - userName
     *   - content
     *   - targetQCommentOId (null 가능)
     *
     * 기능
     *   - QnA 댓글 추가
     *
     * 출력
     *   - qnACommentArr
     *     - 해당 QnA의 댓글 목록
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.addQnAComment(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // GET AREA:

  @Get('/loadQnA/:qnAOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadQnA(@Headers() headers: any, @Param('qnAOId') qnAOId: string) {
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
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadQnA(jwtPayload, qnAOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Get('/loadQnACommentArr/:qnAOId')
  @UseGuards(CheckJwtValidationGuard)
  async loadQnACommentArr(@Headers() headers: any, @Param('qnAOId') qnAOId: string) {
    /**
     * 입력
     *   - qnAOId (URL 파라미터)
     *
     * 기능
     *   - qnAOId로 QnA 댓글 목록을 조회한다
     *   - 비공개 질문글이면 당사자나 관리자만 읽을 수 있음
     *   - 비공개 질문글이 아니면 유저 권한만 있으면 볼 수 있음
     *
     * 출력
     *   - qnACommentArr
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadQnACommentArr(jwtPayload, qnAOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  @Get('/loadQnARowArr')
  async loadQnARowArr() {
    /**
     * 입력
     *   - 없음
     *
     * 기능
     *   - QnA 목록을 조회한다
     *
     * 출력
     *   - qnARowArr
     */
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.loadQnARowArr()
    return {ok, body, gkdErrMsg, statusCode}
  }

  // PUT AREA:

  @Put('/modifyQnA')
  @UseGuards(CheckJwtValidationGuard)
  async modifyQnA(@Headers() headers: any, @Body() data: HTTP.ModifyQnAType) {
    /**
     * 입력
     *   - qnAOId
     *   - title (선택)
     *   - content (선택)
     *   - isPrivate (선택)
     *
     * 기능
     *   - QnA 수정
     *   - 작성자나 관리자만 수정 가능
     *
     * 출력
     *   - qnA
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.modifyQnA(jwtPayload, data)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }

  // DELETE AREA:

  @Delete('/deleteQnA/:qnAOId')
  @UseGuards(CheckJwtValidationGuard)
  async deleteQnA(@Headers() headers: any, @Param('qnAOId') qnAOId: string) {
    /**
     * 입력
     *   - qnAOId (URL 파라미터)
     *
     * 기능
     *   - QnA 삭제
     *   - 작성자나 관리자만 삭제 가능
     *
     * 출력
     *   - 없음
     */
    const {jwtFromServer, jwtPayload} = headers
    const {ok, body, gkdErrMsg, statusCode} = await this.clientService.deleteQnA(jwtPayload, qnAOId)
    return {ok, body, gkdErrMsg, statusCode, jwtFromServer}
  }
}
