import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'
import {AUTH_ADMIN} from '@secret'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'
import * as ST from '@shareType'
import * as SV from '@shareValue'

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
   *  4. 관리자에게 보낼 알람 생성 뙇!!
   *  5. QnA 및 알람배열 반환 뙇!!
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

      // 2-1-1. title 길이 체크
      if (title.length > SV.QNA_TITLE_LENGTH_MAX) {
        throw {
          gkd: {title: `제목이 너무 김 (최대 ${SV.QNA_TITLE_LENGTH_MAX}자)`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAFile_TitleTooLong',
          gkdErrMsg: `제목이 너무 김 (최대 ${SV.QNA_TITLE_LENGTH_MAX}자)`,
          gkdStatus: {title, titleLength: title.length, maxLength: SV.QNA_TITLE_LENGTH_MAX},
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

      // 2-2-1. content 길이 체크
      if (content.length > SV.QNA_CONTENT_LENGTH_MAX) {
        throw {
          gkd: {content: `내용이 너무 김 (최대 ${SV.QNA_CONTENT_LENGTH_MAX}자)`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAFile_ContentTooLong',
          gkdErrMsg: `내용이 너무 김 (최대 ${SV.QNA_CONTENT_LENGTH_MAX}자)`,
          gkdStatus: {content, contentLength: content.length, maxLength: SV.QNA_CONTENT_LENGTH_MAX},
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

      // 4. 관리자에게 보낼 알람 생성 뙇!!
      const {userArr} = await this.dbHubService.readUserArrByUserAuth(where, AUTH_ADMIN)
      const alarmArr = await Promise.all(
        userArr.map(async user => {
          const dtoAlarm: DTO.CreateAlarmDTO = {
            alarmType: SV.ALARM_TYPE_QNA_NEW,
            content: `새로운 QnA가 추가되었습니다.`,
            createdAt: new Date(),
            fileOId: null,
            qnAOId: qnA.qnAOId,
            senderUserName: userName,
            senderUserOId: userOId,
            userOId: user.userOId
          }
          const {alarm} = await this.dbHubService.createAlarm(where, dtoAlarm)
          return alarm
        })
      )

      // 5. qnAOId 반환 뙇!!
      return {alarmArr, qnA}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * addQnAComment
   *  - QnA 댓글을 추가한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!!
   *  2. 입력값 췍!!
   *  3. QnA 존재 여부 체크 뙇!!
   *  4. QnA 댓글 추가 뙇!!
   *  5. 댓글 목록 조회 및 반환 뙇!!
   */
  async addQnAComment(jwtPayload: T.JwtPayloadType, data: HTTP.AddQnACommentType) {
    const where = `/client/qna/addQnAComment`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)
      const {userName, userOId} = jwtPayload

      // 2. 입력값 췍!!
      const {content, qnAOId, targetQCommentOId} = data

      // 2-1. content 체크
      if (!content || content.trim().length === 0) {
        throw {
          gkd: {content: `댓글 내용이 없음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAComment_InvalidContent',
          gkdErrMsg: `댓글 내용이 없음`,
          gkdStatus: {content},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-1-1. content 길이 체크
      if (content.length > SV.COMMENT_MAX_LENGTH) {
        throw {
          gkd: {content: `댓글이 너무 김 (최대 ${SV.COMMENT_MAX_LENGTH}자)`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAComment_ContentTooLong',
          gkdErrMsg: `댓글이 너무 김 (최대 ${SV.COMMENT_MAX_LENGTH}자)`,
          gkdStatus: {content, contentLength: content.length, maxLength: SV.COMMENT_MAX_LENGTH},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-2. userOId 일치 체크
      if (userOId !== data.userOId) {
        throw {
          gkd: {userOId: `유저 오브젝트 아이디가 일치하지 않음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAComment_InvalidUserOId',
          gkdErrMsg: `유저 오브젝트 아이디가 일치하지 않음`,
          gkdStatus: {userOId: data.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 2-3. userName 일치 체크
      if (userName !== data.userName) {
        throw {
          gkd: {userName: `유저 이름이 일치하지 않음`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAComment_InvalidUserName',
          gkdErrMsg: `유저 이름이 일치하지 않음`,
          gkdStatus: {userName: data.userName},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. QnA 존재 여부 체크 뙇!!
      const {qnA} = await this.dbHubService.readQnAByQnAOId(where, qnAOId)
      if (!qnA) {
        throw {
          gkd: {qnAOId: `존재하지 않는 QnA`},
          gkdErrCode: 'CLIENTQNAPORT_addQnAComment_InvalidQnAOId',
          gkdErrMsg: `존재하지 않는 QnA`,
          gkdStatus: {qnAOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const dto: DTO.CreateQnACommentDTO = {content, qnAOId, targetQCommentOId, userName, userOId}

      // 4. QnA 댓글 추가 뙇!!
      await this.dbHubService.createQnAComment(where, dto)

      // 5. 댓글 목록 조회 및 반환 뙇!!
      const {qnACommentArr} = await this.dbHubService.readQnACommentArrByQnAOId(where, qnAOId)

      return {qnACommentArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * loadQnA
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
  async loadQnA(jwtPayload: T.JwtPayloadType, qnAOId: string) {
    const where = `/client/qna/loadQnA`

    try {
      // 1. 권한 췍!! (해당 QnA를 읽을 권한이 있는지 확인)
      const {qnA} = await this.dbHubService.checkAuth_QnARead(where, jwtPayload, qnAOId)

      // 2. 조회수 증가 뙇!!
      await this.dbHubService.incrementQnAViewCount(where, qnAOId)

      // 3. QnA 반환 뙇!!
      return {qnA}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadQnACommentArr
   *  - qnAOId로 QnA 댓글 목록을 조회한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!! (해당 QnA를 읽을 권한이 있는지 확인)
   *  2. 댓글 목록 조회 뙇!!
   *  3. 댓글 목록 반환 뙇!!
   */
  async loadQnACommentArr(jwtPayload: T.JwtPayloadType, qnAOId: string) {
    const where = `/client/qna/loadQnACommentArr`

    try {
      // 1. 권한 췍!! (해당 QnA를 읽을 권한이 있는지 확인)
      await this.dbHubService.checkAuth_QnARead(where, jwtPayload, qnAOId)

      // 2. 댓글 목록 조회 뙇!!
      const {qnACommentArr} = await this.dbHubService.readQnACommentArrByQnAOId(where, qnAOId)

      // 3. 댓글 목록 반환 뙇!!
      return {qnACommentArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadQnARowArr
   *  - QnA 목록을 조회한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. QnA 목록 조회 뙇!!
   *  2. QnA 목록 반환 뙇!!
   */
  async loadQnARowArr() {
    const where = `/client/qna/loadQnARowArr`

    try {
      // 1. QnA 목록 조회 뙇!!
      const {qnAArr} = await this.dbHubService.readQnAArr(where)

      const qnARowArr: ST.QnARowType[] = qnAArr.map(qnA => ({
        qnAOId: qnA.qnAOId,
        title: qnA.title,
        userName: qnA.userName,
        userOId: qnA.userOId,
        isPrivate: qnA.isPrivate,
        viewCount: qnA.viewCount,
        createdAt: qnA.createdAt,
        updatedAt: qnA.updatedAt
      }))

      // 2. QnA 목록 반환 뙇!!
      return {qnARowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // PUT AREA:

  /**
   * modifyQnA
   *  - QnA를 수정한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!! (수정 권한 체크)
   *     - 작성자나 관리자만 수정 가능
   *  2. 입력값 췍!!
   *  3. QnA 수정 뙇!!
   *  4. 수정된 QnA 반환 뙇!!
   */
  async modifyQnA(jwtPayload: T.JwtPayloadType, data: HTTP.ModifyQnAType) {
    const where = `/client/qna/modifyQnA`

    try {
      // 1. 권한 췍!! (수정 권한 체크)
      await this.dbHubService.checkAuth_QnAEdit(where, jwtPayload, data.qnAOId)

      // 2. 입력값 췍!!
      const {title, content, isPrivate} = data

      // 5-1. title 체크 (제공된 경우)
      if (title !== undefined) {
        if (!title || title.trim().length === 0) {
          throw {
            gkd: {title: `제목이 없음`},
            gkdErrCode: 'CLIENTQNAPORT_modifyQnA_InvalidTitle',
            gkdErrMsg: `제목이 없음`,
            gkdStatus: {title},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }

        if (title.length > SV.QNA_TITLE_LENGTH_MAX) {
          throw {
            gkd: {title: `제목이 너무 김 (최대 ${SV.QNA_TITLE_LENGTH_MAX}자)`},
            gkdErrCode: 'CLIENTQNAPORT_modifyQnA_TitleTooLong',
            gkdErrMsg: `제목이 너무 김 (최대 ${SV.QNA_TITLE_LENGTH_MAX}자)`,
            gkdStatus: {title, titleLength: title.length, maxLength: SV.QNA_TITLE_LENGTH_MAX},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }
      }

      // 5-2. content 체크 (제공된 경우)
      if (content !== undefined) {
        if (!content || content.trim().length === 0) {
          throw {
            gkd: {content: `내용이 없음`},
            gkdErrCode: 'CLIENTQNAPORT_modifyQnA_InvalidContent',
            gkdErrMsg: `내용이 없음`,
            gkdStatus: {content},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }

        if (content.length > SV.QNA_CONTENT_LENGTH_MAX) {
          throw {
            gkd: {content: `내용이 너무 김 (최대 ${SV.QNA_CONTENT_LENGTH_MAX}자)`},
            gkdErrCode: 'CLIENTQNAPORT_modifyQnA_ContentTooLong',
            gkdErrMsg: `내용이 너무 김 (최대 ${SV.QNA_CONTENT_LENGTH_MAX}자)`,
            gkdStatus: {content, contentLength: content.length, maxLength: SV.QNA_CONTENT_LENGTH_MAX},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }
      }

      // 3. QnA 수정 뙇!!
      const {qnA: updatedQnA} = await this.dbHubService.updateQnA(where, data.qnAOId, title, content, isPrivate)

      // 4. 수정된 QnA 반환 뙇!!
      return {qnA: updatedQnA}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // DELETE AREA:

  /**
   * deleteQnA
   *  - QnA를 삭제한다
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 권한 췍!! (삭제 권한 체크)
   *     - 작성자나 관리자만 삭제 가능
   *  2. QnA 삭제 뙇!!
   */
  async deleteQnA(jwtPayload: T.JwtPayloadType, qnAOId: string) {
    const where = `/client/qna/deleteQnA`

    try {
      // 1. 권한 췍!! (삭제 권한 체크)
      await this.dbHubService.checkAuth_QnAEdit(where, jwtPayload, qnAOId)

      // 2. QnA 삭제 뙇!!
      await this.dbHubService.deleteQnA(where, qnAOId)

      return {}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
