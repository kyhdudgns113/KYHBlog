import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '@type'
import {ClientQnaPortService} from '@modules/database'
import {SocketService} from '@modules/socket'
import * as U from '@util'
import * as HTTP from '@httpDataType'

@Injectable()
export class ClientQnaService {
  constructor(
    private readonly portService: ClientQnaPortService,
    private readonly socketService: SocketService
  ) {}

  // POST AREA:

  async addQnAFile(jwtPayload: JwtPayloadType, data: HTTP.AddQnAType) {
    /**
     * QnA를 추가하고 qnAOId를 반환한다
     *
     * 작동순서
     *
     *  1. QnA 추가
     *  2. 관리자에게 알람을 보낸다.
     *  3. qnAOId 반환
     */
    try {
      // 1. QnA 추가
      const {alarmArr, qnA} = await this.portService.addQnAFile(jwtPayload, data)
      const {qnAOId} = qnA

      // 2. 관리자에게 알람을 보낸다. (비동기로 처리한다.)
      Promise.all(alarmArr.map(alarm => this.socketService.sendUserAlarm(alarm)))

      return {ok: true, body: {qnAOId}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async addQnAComment(jwtPayload: JwtPayloadType, data: HTTP.AddQnACommentType) {
    /**
     * QnA 댓글을 추가하고 댓글 목록을 반환한다
     */
    try {
      const {qnACommentArr} = await this.portService.addQnAComment(jwtPayload, data)
      return {ok: true, body: {qnACommentArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadQnA(jwtPayload: JwtPayloadType, qnAOId: string) {
    /**
     * qnAOId로 QnA를 조회한다
     */
    try {
      const {qnA} = await this.portService.loadQnA(jwtPayload, qnAOId)
      return {ok: true, body: {qnA}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadQnACommentArr(jwtPayload: JwtPayloadType, qnAOId: string) {
    /**
     * qnAOId로 QnA 댓글 목록을 조회한다
     */
    try {
      const {qnACommentArr} = await this.portService.loadQnACommentArr(jwtPayload, qnAOId)
      return {ok: true, body: {qnACommentArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadQnARowArr() {
    /**
     * QnA 목록을 조회한다
     */
    try {
      const {qnARowArr} = await this.portService.loadQnARowArr()
      return {ok: true, body: {qnARowArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // PUT AREA:

  async modifyQnA(jwtPayload: JwtPayloadType, data: HTTP.ModifyQnAType) {
    /**
     * QnA를 수정한다
     */
    try {
      const {qnA} = await this.portService.modifyQnA(jwtPayload, data)
      return {ok: true, body: {qnA}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // DELETE AREA:

  async deleteQnA(jwtPayload: JwtPayloadType, qnAOId: string) {
    /**
     * QnA를 삭제한다
     */
    try {
      await this.portService.deleteQnA(jwtPayload, qnAOId)
      return {ok: true, body: {}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
