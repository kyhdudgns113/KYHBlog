import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'
import {AUTH_ADMIN} from '@secret'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'

@Injectable()
export class ClientQnaPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // POST AREA:

  /**
   * addQnAFile
   *  - QnA를 추가하고 qnAOId를 반환한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. QnA 추가 뙇!!
   *  4. qnAOId 반환 뙇!!
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

      // 4. qnAOId 반환 뙇!!
      return {qnAOId: qnA.qnAOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * getQnA
   *  - qnAOId로 QnA를 조회한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!! (유저 권한 체크)
   *  2. QnA 조회 뙇!!
   *  3. QnA 존재 여부 체크 뙇!!
   *  4. 비공개 QnA 권한 체크 뙇!!
   *     - 비공개 질문글이면: 당사자나 관리자만 읽을 수 있음
   *     - 비공개 질문글이 아니면: 유저 권한만 있으면 볼 수 있음
   *  5. 조회수 증가 뙇!!
   *  6. QnA 반환 뙇!!
   */
  async getQnA(jwtPayload: T.JwtPayloadType, qnAOId: string) {
    const where = `/client/qna/getQnA`

    try {
      // 1. 권한 췍!! (유저 권한 체크)
      const {user} = await this.dbHubService.checkAuthUser(where, jwtPayload)
      const {userOId} = jwtPayload

      // 2. QnA 조회 뙇!!
      const {qnA} = await this.dbHubService.readQnAByQnAOId(where, qnAOId)

      // 3. QnA 존재 여부 체크 뙇!!
      if (!qnA) {
        throw {
          gkd: {qnAOId: `존재하지 않는 QnA`},
          gkdErrCode: 'CLIENTQNAPORT_getQnA_InvalidQnAOId',
          gkdErrMsg: `존재하지 않는 QnA`,
          gkdStatus: {qnAOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 4. 비공개 QnA 권한 체크 뙇!!
      if (qnA.isPrivate) {
        // 비공개 질문글이면: 당사자나 관리자만 읽을 수 있음
        const isOwner = qnA.userOId === userOId
        const isAdmin = user.userAuth === AUTH_ADMIN

        if (!isOwner && !isAdmin) {
          throw {
            gkd: {qnAOId: `권한이 없음`},
            gkdErrCode: 'CLIENTQNAPORT_getQnA_NoPermission',
            gkdErrMsg: `비공개 질문글은 작성자나 관리자만 볼 수 있습니다.`,
            gkdStatus: {qnAOId},
            statusCode: 403,
            where
          } as T.ErrorObjType
        }
      }
      // 비공개 질문글이 아니면: 유저 권한만 있으면 볼 수 있음 (이미 checkAuthUser로 체크됨)

      // 5. 조회수 증가 뙇!!
      await this.dbHubService.incrementQnAViewCount(where, qnAOId)

      // 6. QnA 반환 뙇!!
      return {qnA}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
