import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '@type'

@Injectable()
export class CopyMeService {
  constructor() {}

  async copyMeGet(jwtPayload: JwtPayloadType, testArg: any) {
    try {
      return {ok: true, body: {}, errObj: {}}
      // ::
    } catch (errObj) {
      // ::
      return {ok: false, body: {}, errObj}
    }
  }
}
