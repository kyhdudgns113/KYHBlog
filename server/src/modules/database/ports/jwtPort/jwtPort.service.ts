import {Injectable} from '@nestjs/common'
import {DBHubService} from '../../dbHub'
import {AUTH_ADMIN} from '@secret'

@Injectable()
export class JwtPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  /**
   * 여기서는 권한 체크를 안한다 \
   * 권한이 있는지 확인하는곳에서 DB 접근을 할 수 있냐고 물어보는건 이상한 짓이다
   */
  async checkUserAdmin(userOId: string) {
    const where = '/guard/checkUserAdmin'
    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      const {userAuth} = user
      if (userAuth !== AUTH_ADMIN) {
        throw {
          gkd: {userAuth: '관리자만 가능합니다.'},
          gkdErrMsg: '관리자만 가능합니다.',
          gkdStatus: {userAuth},
          statusCode: 400,
          where
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readUserAuthByUserOId(userOId: string) {
    const where = '/guard/readUserAuthByUserOId'
    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)
      const {userAuth} = user
      return {userAuth}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
