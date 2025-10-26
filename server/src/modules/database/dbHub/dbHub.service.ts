import {Injectable} from '@nestjs/common'
import {AUTH_ADMIN, AUTH_USER} from '@secret'

import * as DB from '../_tables'
import * as DTO from '@dto'
import * as T from '@type'

/**
 * 이곳은 거의 대부분 Schema 의 함수랑 결과를 그대로 보내주는 역할만 한다.
 *
 * 이것들은 port 에서 해줘야 한다.
 * - 인자의 Error 체크
 * - 권한 체크 함수 실행
 *    - port 에서 db 접근할때마다 권한체크하면 오버헤드 심해진다.
 *
 * 이건 여기서 해준다.
 * - 권한 체크 함수 작성
 */
@Injectable()
export class DBHubService {
  constructor(
    private readonly alarmDBService: DB.AlarmDBService,
    private readonly chatDBService: DB.ChatDBService,
    private readonly commentDBService: DB.CommentDBService,
    private readonly dirDBService: DB.DirectoryDBService,
    private readonly fileDBService: DB.FileDBService,
    private readonly logDBService: DB.LogDBService,
    private readonly userDBService: DB.UserDBService
  ) {}

  // AREA1: AlarmDB Area
  async createAlarm(where: string, dto: DTO.CreateAlarmDTO) {
    try {
      const {alarm} = await this.alarmDBService.createAlarm(where, dto)
      return {alarm}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readAlarmArrByUserOId(where: string, userOId: string) {
    try {
      const {alarmArr} = await this.alarmDBService.readAlarmArrByUserOId(where, userOId)
      return {alarmArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateAlarmStatusOld(where: string, checkedAlarmArr: T.AlarmType[]) {
    try {
      await this.alarmDBService.updateAlarmStatusOld(where, checkedAlarmArr)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteAlarm(where: string, alarmOId: string) {
    try {
      await this.alarmDBService.deleteAlarm(where, alarmOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA2: ChatDB Area
  async createChat(where: string, dto: DTO.CreateChatDTO) {
    try {
      const {chat} = await this.chatDBService.createChat(where, dto)
      return {chat}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createChatRoom(where: string, dto: DTO.CreateChatRoomDTO) {
    try {
      const {chatRoom} = await this.chatDBService.createChatRoom(where, dto)
      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readChatArrByChatRoomOId(where: string, chatRoomOId: string, firstIdx: number) {
    try {
      const {chatArr} = await this.chatDBService.readChatArrByChatRoomOId(where, chatRoomOId, firstIdx)
      return {chatArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readChatRoomArrByUserOId(where: string, userOId: string) {
    try {
      const {chatRoomArr} = await this.chatDBService.readChatRoomArrByUserOId(where, userOId)
      return {chatRoomArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readChatRoomByBothOId(where: string, userOId: string, targetUserOId: string) {
    try {
      const {chatRoom} = await this.chatDBService.readChatRoomByBothOId(where, userOId, targetUserOId)
      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readChatRoomInfo(where: string, chatRoomOId: string) {
    try {
      const {numChat, refreshs} = await this.chatDBService.readChatRoomInfo(where, chatRoomOId)
      return {numChat, refreshs}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateChatRoomLast(where: string, chatRoomOId: string, lastChatDate: Date) {
    try {
      await this.chatDBService.updateChatRoomLast(where, chatRoomOId, lastChatDate)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateChatRoomUnreadCntIncrease(where: string, chatRoomOId: string, unreadUserOIdArr: string[]) {
    try {
      await this.chatDBService.updateChatRoomUnreadCntIncrease(where, chatRoomOId, unreadUserOIdArr)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateChatRoomUnreadCntZero(where: string, chatRoomOId: string, userOIdArr: string[]) {
    try {
      await this.chatDBService.updateChatRoomUnreadCntZero(where, chatRoomOId, userOIdArr)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA3: CommentDB Area
  async createComment(where: string, dto: DTO.CreateCommentDTO) {
    try {
      await this.commentDBService.createComment(where, dto)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createReply(where: string, dto: DTO.CreateReplyDTO) {
    try {
      await this.commentDBService.createReply(where, dto)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readCommentByCommentOId(where: string, commentOId: string) {
    try {
      const {comment} = await this.commentDBService.readCommentByCommentOId(where, commentOId)
      return {comment}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readCommentReplyArrByCommentOId(where: string, commentOId: string) {
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.commentDBService.readCommentReplyArrByCommentOId(where, commentOId)
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readCommentReplyArrByFileOId(where: string, fileOId: string) {
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.commentDBService.readCommentReplyArrByFileOId(where, fileOId)
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readCommentReplyArrByReplyOId(where: string, replyOId: string) {
    try {
      const {commentReplyArr, entireCommentReplyLen} = await this.commentDBService.readCommentReplyArrByReplyOId(where, replyOId)
      return {commentReplyArr, entireCommentReplyLen}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateComment(where: string, commentOId: string, newContent: string) {
    try {
      await this.commentDBService.updateComment(where, commentOId, newContent)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateReplyContent(where: string, replyOId: string, newContent: string) {
    try {
      await this.commentDBService.updateReplyContent(where, replyOId, newContent)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteComment(where: string, commentOId: string) {
    try {
      const {fileOId} = await this.commentDBService.deleteComment(where, commentOId)
      return {fileOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async deleteReply(where: string, replyOId: string) {
    try {
      const {fileOId} = await this.commentDBService.deleteReply(where, replyOId)
      return {fileOId}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA4: DirectoryDB Area
  async createDir(where: string, dto: DTO.CreateDirDTO) {
    try {
      const {directory} = await this.dirDBService.createDir(where, dto)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async createDirRoot(where: string) {
    try {
      const {directory} = await this.dirDBService.createDirRoot(where)
      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirArrByParentDirOId(where: string, parentDirOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.readDirArrByParentDirOId(where, parentDirOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirByDirOId(where: string, dirOId: string) {
    try {
      const {directory, fileRowArr} = await this.dirDBService.readDirByDirOId(where, dirOId)
      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readDirRoot(where: string) {
    try {
      const {directory, fileRowArr} = await this.dirDBService.readDirRoot(where)
      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateDirArr_Dir(where: string, dirOId: string, subDirOIdsArr: string[]) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirArr_Dir(where, dirOId, subDirOIdsArr)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirArr_File(where: string, dirOId: string, subFileOIdsArr: string[]) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirArr_File(where, dirOId, subFileOIdsArr)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateDirName(where: string, dirOId: string, dirName: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.updateDirName(where, dirOId, dirName)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteDir(where: string, dirOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.dirDBService.deleteDir(where, dirOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async isAncestor(where: string, baseDirOId: string, targetDirOId: string) {
    try {
      return await this.dirDBService.isAncestor(where, baseDirOId, targetDirOId)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA5: FileDB Area
  async createFile(where: string, dto: DTO.CreateFileDTO) {
    try {
      const {file} = await this.fileDBService.createFile(where, dto)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readFileByFileOId(where: string, fileOId: string) {
    try {
      const {file} = await this.fileDBService.readFileByFileOId(where, fileOId)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readFileNotice(where: string) {
    try {
      const {file} = await this.fileDBService.readFileNotice(where)
      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const {fileRowArr} = await this.fileDBService.readFileRowArrByDirOId(where, dirOId)
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateFileName(where: string, fileOId: string, fileName: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.updateFileName(where, fileOId, fileName)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFileNameContent(where: string, fileOId: string, fileName: string, content: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.updateFileNameContent(where, fileOId, fileName, content)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async updateFileStatus(where: string, fileOId: string, fileStatus: number) {
    try {
      await this.fileDBService.updateFileStatus(where, fileOId, fileStatus)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteFile(where: string, fileOId: string) {
    try {
      const {directoryArr, fileRowArr} = await this.fileDBService.deleteFile(where, fileOId)
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA6: LogDB Area
  async createLog(where: string, dto: DTO.CreateLogDTO) {
    try {
      const {log} = await this.logDBService.createLog(where, dto)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readLogEntire(where: string) {
    try {
      const {logArr} = await this.logDBService.readLogEntire(where)
      return {logArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async deleteLogDateBefore(where: string, deleteDateBefore: Date) {
    try {
      await this.logDBService.deleteLogDateBefore(where, deleteDateBefore)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA1: UserDB Area
  async createUser(where: string, dto: DTO.SignUpDTO) {
    try {
      const {user} = await this.userDBService.createUser(where, dto)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readUserArr(where: string) {
    try {
      const {userArr} = await this.userDBService.readUserArr(where)
      return {userArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserIdAndPassword(where: string, userId: string, password: string) {
    try {
      const {user} = await this.userDBService.readUserByUserIdAndPassword(where, userId, password)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readUserByUserOId(where: string, userOId: string) {
    try {
      const {user} = await this.userDBService.readUserByUserOId(where, userOId)
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateUserUpdatedAt(where: string, userOId: string, updatedAt: Date) {
    try {
      await this.userDBService.updateUserUpdatedAt(where, userOId, updatedAt)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  // AREA2: CheckAuth

  async checkAuthAdmin(where: string, jwtPayload: T.JwtPayloadType) {
    try {
      const {userOId} = jwtPayload
      const {user} = await this.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noUser',
          gkdErrMsg: `유저가 없음`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      if (user.userAuth !== AUTH_ADMIN) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuthUser(where: string, jwtPayload: T.JwtPayloadType) {
    try {
      const {userOId} = jwtPayload
      const {user} = await this.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noUser',
          gkdErrMsg: `유저가 없음`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      if (user.userAuth < AUTH_USER) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuthAdmin_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_Alarm(where: string, jwtPayload: T.JwtPayloadType, alarmOId: string) {
    try {
      const {alarm} = await this.alarmDBService.readAlarmByAlarmOId(where, alarmOId)
      if (!alarm) {
        throw {
          gkd: {noAlarm: `알람이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Alarm_noAlarm',
          gkdErrMsg: `알람이 없습니다.`,
          gkdStatus: {alarmOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)
      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Alarm_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId: alarm.userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const isAlreadyBanned = user.userAuth < AUTH_USER
      const isDifferentUser = user.userOId !== alarm.userOId

      if (isAlreadyBanned || isDifferentUser) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Alarm_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_ChatRoom(where: string, jwtPayload: T.JwtPayloadType, chatRoomOId: string) {
    try {
      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_ChatRoom_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const isChatRoomUser = await this.chatDBService.isChatRoomUser(where, jwtPayload.userOId, chatRoomOId)
      const isAdmin = user.userAuth === AUTH_ADMIN

      if (!isChatRoomUser && !isAdmin) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_ChatRoom_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_Comment(where: string, jwtPayload: T.JwtPayloadType, commentOId: string) {
    try {
      const {comment} = await this.commentDBService.readCommentByCommentOId(where, commentOId)
      if (!comment) {
        throw {
          gkd: {noComment: `댓글이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noComment',
          gkdErrMsg: `댓글이 없습니다.`,
          gkdStatus: {commentOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)
      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId: comment.userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const isAlreadyBanned = user.userAuth < AUTH_USER
      const isDifferentUser = user.userOId !== comment.userOId
      const isAdmin = user.userAuth === AUTH_ADMIN

      if (isAlreadyBanned || (isDifferentUser && !isAdmin)) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Comment_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_Reply(where: string, jwtPayload: T.JwtPayloadType, replyOId: string) {
    const {reply} = await this.commentDBService.readReplyByReplyOId(where, replyOId)

    try {
      if (!reply) {
        throw {
          gkd: {noReply: `대댓글이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Reply_noReply',
          gkdErrMsg: `대댓글이 없습니다.`,
          gkdStatus: {replyOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)
      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Reply_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId: reply.userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const isAlreadyBanned = user.userAuth < AUTH_USER
      const isDifferentUser = user.userOId !== reply.userOId
      const isAdmin = user.userAuth === AUTH_ADMIN

      if (isAlreadyBanned || (isDifferentUser && !isAdmin)) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_Reply_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId: jwtPayload.userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async checkAuth_User(where: string, jwtPayload: T.JwtPayloadType, userOId: string) {
    try {
      const {user} = await this.readUserByUserOId(where, jwtPayload.userOId)
      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'DBHUB_checkAuth_User_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      if (user.userOId !== userOId && user.userAuth !== AUTH_ADMIN) {
        throw {
          gkd: {noAuth: `권한이 없음`},
          gkdErrCode: 'DBHUB_checkAuth_User_noAuth',
          gkdErrMsg: `권한이 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      return {user}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
