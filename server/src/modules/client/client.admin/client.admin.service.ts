import {Injectable} from '@nestjs/common'
import {ClientAdminPortService} from '@modules/database'

import * as U from '@util'
import * as T from '@type'

@Injectable()
export class ClientAdminService {
  constructor(private readonly portService: ClientAdminPortService) {}

  // GET AREA:

  async loadLogArr(jwtPayload: T.JwtPayloadType) {
    try {
      const {logArr} = await this.portService.loadLogArr(jwtPayload)
      return {ok: true, body: {logArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadUserArr(jwtPayload: T.JwtPayloadType) {
    try {
      const {userArr} = await this.portService.loadUserArr(jwtPayload)
      return {ok: true, body: {userArr}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
