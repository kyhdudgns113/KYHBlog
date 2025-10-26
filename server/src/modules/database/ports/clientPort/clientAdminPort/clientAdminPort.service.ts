import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as T from '@type'

@Injectable()
export class ClientAdminPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // GET AREA:

  /**
   * loadLogArr
   *  - 로그 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - logArr: 로그 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 로그 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   */
  async loadLogArr(jwtPayload: T.JwtPayloadType) {
    const where = `/client/admin/loadLogArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 로그 배열 조회 뙇!!
      const {logArr} = await this.dbHubService.readLogEntire(where)

      // 3. 리턴 뙇!!
      return {logArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadUserArr
   *  - 유저 배열을 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - userArr: 유저 배열
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 유저 배열 조회 뙇!!
   *  3. 리턴 뙇!!
   */
  async loadUserArr(jwtPayload: T.JwtPayloadType) {
    const where = `/client/admin/loadUserArr`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 유저 배열 조회 뙇!!
      const {userArr} = await this.dbHubService.readUserArr(where)

      // 3. 리턴 뙇!!
      return {userArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
