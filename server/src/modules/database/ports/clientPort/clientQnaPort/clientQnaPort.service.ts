import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'

@Injectable()
export class ClientQnaPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // POST AREA:

  /**
   * addQnAFile
   *  - QnA를 추가하고 전체 QnA 배열을 최신순으로 반환한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. QnA 추가 뙇!!
   *  4. 전체 QnA 배열 읽어오기 뙇!! (최신순)
   */
  async addQnAFile(jwtPayload: T.JwtPayloadType, data: HTTP.AddQnAType) {
    const where = `/client/qna/addQnAFile`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)
      const {userName, userOId} = jwtPayload

      // 2. 입력값 췍!!
      const {title, content, isPrivate} = data

      // 2-1. title 체크
      if (!title || title.trim().length === 0) {
        throw {
          gkd: {title: `제목이 없음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAFile_InvalidTitle',
          gkdErrMsg: `제목이 없음`,
          gkdStatus: {title},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-2. content 체크
      if (!content || content.trim().length === 0) {
        throw {
          gkd: {content: `내용이 없음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAFile_InvalidContent',
          gkdErrMsg: `내용이 없음`,
          gkdStatus: {content},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-3. userOId 일치 체크
      if (userOId !== data.userOId) {
        throw {
          gkd: {userOId: `유저 오브젝트 아이디가 일치하지 않음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAFile_InvalidUserOId',
          gkdErrMsg: `유저 오브젝트 아이디가 일치하지 않음`,
          gkdStatus: {userOId: data.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const dto: DTO.CreateQnADTO = {title, content, isPrivate, userName, userOId}

      // 3. QnA 추가 뙇!!
      const {qnA} = await this.dbHubService.createQnA(where, dto)

      // 4. 전체 QnA 배열 읽어오기 뙇!! (최신순)
      const {qnAArr} = await this.dbHubService.readQnAArr(where)

      return {qnA, qnAArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
