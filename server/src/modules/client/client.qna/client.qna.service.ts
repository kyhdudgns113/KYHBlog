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
     * QnA를 추가하고 전체 QnA 배열을 최신순으로 반환한다
     */
    try {
      const {qnA, qnAArr} = await this.portService.addQnAFile(jwtPayload, data)
      return {ok: true, body: {qnA, qnAArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
