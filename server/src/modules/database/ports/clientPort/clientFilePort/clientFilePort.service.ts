import {DBHubService} from '../../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'
import * as U from '@util'
import * as V from '@value'

@Injectable()
export class ClientFilePortService {
  constructor(private readonly dbHubService: DBHubService) {}

  // POST AREA:

  async addComment(jwtPayload: T.JwtPayloadType, data: HTTP.AddCommentType) {
    const where = `/client/file/addComment`

    const {content, fileOId, userName, userOId} = data

    /**
     * {userName, userOId} 유저가 fileOId 파일에 댓글을 추가한다.
     *
     * ------
     *
     * 순서
     *
     *   1. 권한 췍!!
     *   2. 댓글 추가 뙇!!
     *   3. 리턴용 댓글 배열 뙇!!
     *   4. 리턴 뙇!!
     */
    try {
      let alarm: T.AlarmType | null = null

      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)

      // 2. 댓글 추가 뙇!!
      const dto: DTO.CreateCommentDTO = {
        content,
        fileOId,
        userName,
        userOId
      }
      await this.dbHubService.createComment(where, dto)

      // 3. 댓글 달린 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)

      // 4. 댓글 작성자가 파일 작성자랑 다르면 알람 생성 뙇!!
      if (file.userOId !== userOId) {
        const createdAt = new Date()
        const dto: DTO.CreateAlarmDTO = {
          alarmType: V.ALARM_TYPE_FILE_COMMENT,
          content,
          createdAt,
          fileOId,
          senderUserName: userName,
          senderUserOId: userOId,
          userOId: file.userOId
        }
        const {alarm: _alarm} = await this.dbHubService.createAlarm(where, dto)

        alarm = _alarm
      }

      // 5. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 6. 리턴 뙇!!
      return {alarm, commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * addReply
   *   - {userName, userOId} 유저가 commentOId 댓글에 대댓글을 추가한다.
   *   - 대댓글 대상 유저는 {targetUserOId, targetUserName} 이다.
   *
   * ------
   *
   * 리턴
   *
   *   - commentReplyArr: 전송할 댓글 배열
   *   - entireCommentReplyLen: 전체 댓글 개수
   *
   * ------
   *
   * 순서
   *
   *   1. 권한 췍!!
   *   2. 대댓글 추가 뙇!!
   *   3. 리턴용 댓글 배열 뙇!!
   *   4. 댓글 정보 뙇!!
   *   5. 본인 댓글이나 대댓글에 대댓글 작성하는게 아니라면 알람 뙇!!
   *     - 대댓글 대상 유저에게 알람 뙇!!
   *     - 댓글 작성자와 대댓글 대상 유저가 다르다면 댓글 작성자에게 알람 뙇!!
   *   6. 리턴 뙇!!
   */
  async addReply(jwtPayload: T.JwtPayloadType, data: HTTP.AddReplyType) {
    const where = `/client/file/addReply`

    const {commentOId, content, targetUserOId, targetUserName, userName, userOId} = data

    try {
      let alarmComment: T.AlarmType | null = null
      let alarmTarget: T.AlarmType | null = null

      // 1. 권한 췍!!
      await this.dbHubService.checkAuthUser(where, jwtPayload)

      // 2. 대댓글 추가 뙇!!
      const dto: DTO.CreateReplyDTO = {
        commentOId,
        content,
        targetUserOId,
        targetUserName,
        userName,
        userOId
      }
      await this.dbHubService.createReply(where, dto)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByCommentOId(where, commentOId)

      // 4. 댓글 정보 뙇!!
      const {comment} = await this.dbHubService.readCommentByCommentOId(where, commentOId)

      // 5. 본인 댓글이나 대댓글에 대댓글 작성하는게 아니라면 알람 뙇!!
      const isMyComment = userOId === comment.userOId
      const isMyReply = userOId === comment.userOId
      const isSameTarget = targetUserOId === comment.userOId

      if (!isMyComment && !isMyReply) {
        // 5-1. 대댓글 대상 유저에게 알람 뙇!!
        const createdAt = new Date()
        const dtoReplyReply: DTO.CreateAlarmDTO = {
          alarmType: V.ALARM_TYPE_TAG_REPLY,
          content,
          createdAt,
          fileOId: comment.fileOId,
          senderUserName: userName,
          senderUserOId: userOId,
          userOId: targetUserOId
        }
        alarmTarget = (await this.dbHubService.createAlarm(where, dtoReplyReply)).alarm

        // 5-2. 댓글 작성자와 대댓글 대상 유저가 다르다면 댓글 작성자에게 알람 뙇!!
        if (!isSameTarget) {
          const dtoCommentReply: DTO.CreateAlarmDTO = {
            alarmType: V.ALARM_TYPE_TAG_REPLY,
            content,
            createdAt,
            fileOId: comment.fileOId,
            senderUserName: userName,
            senderUserOId: userOId,
            userOId: comment.userOId
          }
          alarmComment = (await this.dbHubService.createAlarm(where, dtoCommentReply)).alarm
        }
      }

      // 6. 리턴 뙇!!
      return {alarmComment, alarmTarget, commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // PUT AREA:

  async editComment(jwtPayload: T.JwtPayloadType, data: HTTP.EditCommentType) {
    const where = `/client/file/editComment`

    const {commentOId, newContent} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Comment(where, jwtPayload, commentOId)

      // 2. 댓글 수정 뙇!!
      await this.dbHubService.updateComment(where, commentOId, newContent)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByCommentOId(where, commentOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * editFile
   *   - fileOId 파일의 제목이나 내용을 수정한다.
   *
   * ------
   *
   * 순서
   *
   *   1. 권한 췍!!
   *   2. 파일 수정 뙇!!
   *   3. extraDirs, extraFileRows 추가 뙇!!
   *   4. 리턴 뙇!!
   */
  async editFile(jwtPayload: T.JwtPayloadType, data: HTTP.EditFileType) {
    const where = `/client/file/editFile`

    const {fileOId, fileName, content} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 파일 수정 뙇!!
      const {directoryArr, fileRowArr} = await this.dbHubService.updateFileNameContent(where, fileOId, fileName, content)

      // 3. extraDirs, extraFileRows 추가 뙇!!
      const extraDirs = V.NULL_extraDirs()
      const extraFileRows = V.NULL_extraFileRows()

      U.pushExtraDirs_Arr(where, extraDirs, directoryArr)
      U.pushExtraFileRows_Arr(where, extraFileRows, fileRowArr)

      // 4. 리턴 뙇!!
      return {extraDirs, extraFileRows}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async editFileStatus(jwtPayload: T.JwtPayloadType, data: HTTP.EditFileStatusType) {
    const where = `/client/file/editFileStatus`

    const {fileOId, newFileStatus} = data

    /**
     * fileOId 파일의 fileStatus 를 newFileStatus 로 수정한다.
     *
     * ------
     *
     * 리턴
     *
     *   - file: 수정된 파일 정보
     *   - extraDirs: 빈 오브젝트
     *   - extraFileRows: 수정된 파일의 파일행 정보
     *
     * ------
     *
     * 순서
     *
     *   1. 권한 췍!!
     *   2. 파일 상태 수정 뙇!!
     *   3. 파일 조회 뙇!!
     *   4. extraDirs, extraFileRows 추가 뙇!!
     *   5. 리턴 뙇!!
     */
    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuthAdmin(where, jwtPayload)

      // 2. 파일 상태 수정 뙇!!
      await this.dbHubService.updateFileStatus(where, fileOId, newFileStatus)

      // 3. 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)

      // 4. extraDirs, extraFileRows 추가 뙇!!
      const extraDirs = V.NULL_extraDirs()
      const extraFileRows = V.NULL_extraFileRows()
      const fileRow: T.FileRowType = {
        dirOId: file.dirOId,
        fileName: file.fileName,
        fileOId: file.fileOId,
        fileStatus: file.fileStatus
      }

      U.pushExtraFileRows_Single(where, extraFileRows, fileRow)

      // 5. 리턴 뙇!!
      return {extraDirs, extraFileRows, file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async editReply(jwtPayload: T.JwtPayloadType, data: HTTP.EditReplyType) {
    const where = `/client/file/editReply`

    const {replyOId, newContent} = data

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Reply(where, jwtPayload, replyOId)

      // 2. 대댓글 수정 뙇!!
      await this.dbHubService.updateReplyContent(where, replyOId, newContent)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByReplyOId(where, replyOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // GET AREA:

  /**
   * loadComments
   *  - fileOId 파일의 pageIdx 페이지의 댓글을 읽어온다.
   *
   * ------
   *
   * 리턴
   *   - commentArr: 전송할 댓글 배열
   *   - entireCommentLen: 전체 댓글 개수
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 댓글 조회 뙇!!
   *  2. 리턴 뙇!!
   */
  async loadComments(fileOId: string) {
    const where = `/client/file/loadComments`

    try {
      // 1. 댓글 조회 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 2. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadFile
   *  - fileOId 파일의 정보를 읽어온다.
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 파일 조회 뙇!!
   *  2. 존재하지 않으면 에러 뙇!!
   *  3. 파일의 유저정보 조회 뙇!!
   *     - 존재하지 않으면 NULL USER 반환
   *     - 유저가 삭제되었어도 파일정보는 불러와야 한다.
   *  4. 파일과 유저 반환 뙇!!
   *
   * ------
   *
   * 리턴
   *  - file: 파일 정보(파일내용 포함)
   */
  async loadFile(fileOId: string) {
    const where = `/client/directory/loadFile`

    try {
      // 1. 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileByFileOId(where, fileOId)

      // 2. 존재하지 않으면 에러 뙇!!
      if (!file) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'CLIENTDIRPORT_loadFile_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      // 3. 파일의 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserOId(where, file.userOId)

      if (!user) {
        return {file, user: V.NULL_User()}
      }

      // 4. 파일과 유저 반환 뙇!!
      return {file, user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * loadNoticeFile
   *  - 공지 파일의 정보를 읽어온다.
   *
   * ------
   *
   * 리턴
   *  - file: 공지 파일 정보(이게 없으면 NULL FILE, NULL_USER 리턴한다)
   *  - user: 공지 파일의 유저정보
   *
   * ------
   *
   * 코드 내용
   *
   *  1. 공지 파일 조회 뙇!!
   *  2. 공지 파일 없으면 빈 오브젝트들 리턴 뙇!!
   *  3. 공지 파일의 유저정보 조회 뙇!!
   *  4. 리턴 뙇!!
   */
  async loadNoticeFile() {
    const where = `/client/file/loadNoticeFile`

    try {
      // 1. 공지 파일 조회 뙇!!
      const {file} = await this.dbHubService.readFileNotice(where)

      // 2. 공지 파일 없으면 빈 오브젝트들 리턴 뙇!!
      if (!file) {
        return {file: V.NULL_File(), user: V.NULL_User()}
      }

      // 3. 공지 파일의 유저정보 조회 뙇!!
      const {user} = await this.dbHubService.readUserByUserOId(where, file.userOId)

      // 4. 리턴 뙇!!
      return {file, user}

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // DELETE AREA:

  async deleteComment(jwtPayload: T.JwtPayloadType, commentOId: string) {
    const where = `/client/file/deleteComment`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Comment(where, jwtPayload, commentOId)

      // 2. 댓글 삭제 뙇!!
      const {fileOId} = await this.dbHubService.deleteComment(where, commentOId)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteReply(jwtPayload: T.JwtPayloadType, replyOId: string) {
    const where = `/client/file/deleteReply`

    try {
      // 1. 권한 췍!!
      await this.dbHubService.checkAuth_Reply(where, jwtPayload, replyOId)

      // 2. 대댓글 삭제 뙇!!
      const {fileOId} = await this.dbHubService.deleteReply(where, replyOId)

      // 3. 리턴용 댓글 배열 뙇!!
      const {commentReplyArr, entireCommentReplyLen} = await this.dbHubService.readCommentReplyArrByFileOId(where, fileOId)

      // 4. 리턴 뙇!!
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
