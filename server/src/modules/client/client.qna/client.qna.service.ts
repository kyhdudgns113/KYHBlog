import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '@type'
import {ClientQnaPortService} from '@modules/database'
import * as U from '@util'
import * as HTTP from '@httpDataType'

@Injectable()
export class ClientQnaService {
  constructor(private readonly portService: ClientQnaPortService) {}

  // POST AREA:

  async addQnAFile(jwtPayload: JwtPayloadType, data: HTTP.AddQnAType) {
    /**
     * QnA를 추가하고 qnAOId를 반환한다
     */
    try {
      const {qnAOId} = await this.portService.addQnAFile(jwtPayload, data)
      return {ok: true, body: {qnAOId}, gkdErrMsg: '', statusCode: 200}
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
}
