import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'
import * as T from '@type'
import {CHAT_ROOM_STATUS_ACTIVE, CHAT_ROOM_STATUS_INACTIVE} from '@value'

@Injectable()
export class ChatDBService {
  constructor(private readonly dbService: DBService) {}

  // GET AREA:

  async createChat(where: string, dto: T.CreateChatDTO) {
    const connection = await this.dbService.getConnection()

    try {
      const {chatRoomOId, chatIdx, content, createdAt, userOId, userName} = dto

      const query = `INSERT INTO chats (chatRoomOId, chatIdx, content, createdAt, userOId, userName) VALUES (?, ?, ?, ?, ?, ?)`
      const params = [chatRoomOId, chatIdx, content, createdAt, userOId, userName]
      await connection.execute(query, params)

      const chat: T.ChatType = {
        chatRoomOId,
        chatIdx,
        content,
        createdAt,
        userOId,
        userName
      }
      // ::
      return {chat}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async createChatRoom(where: string, dto: T.CreateChatRoomDTO) {
    const connection = await this.dbService.getConnection()
    let chatRoomOId = generateObjectId()
    let isCreated = false

    try {
      while (true) {
        const query = `SELECT chatRoomOId FROM chatRooms WHERE chatRoomOId = ?`
        const [result] = await connection.execute(query, [chatRoomOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        chatRoomOId = generateObjectId()
      }

      const nowDate = new Date()

      const queryChatRoom = `INSERT INTO chatRooms (chatRoomOId, lastChatDate) VALUES (?, ?)`
      const paramsChatRoom = [chatRoomOId, nowDate]
      await connection.execute(queryChatRoom, paramsChatRoom)

      isCreated = true

      const queryChatRoomRouter = `INSERT INTO chatRoomRouters (chatRoomOId, userOId, targetUserOId, roomStatus) VALUES (?, ?, ?, ?)`
      const paramsChatRoomRouter1 = [chatRoomOId, dto.userOId, dto.targetUserOId, CHAT_ROOM_STATUS_ACTIVE]
      const paramsChatRoomRouter2 = [chatRoomOId, dto.targetUserOId, dto.userOId, CHAT_ROOM_STATUS_INACTIVE]
      await connection.execute(queryChatRoomRouter, paramsChatRoomRouter1)
      await connection.execute(queryChatRoomRouter, paramsChatRoomRouter2)

      const queryTargetUser = `SELECT userId, userName, userMail FROM users WHERE userOId = ?`
      const paramsTargetUser = [dto.targetUserOId]
      const [resultTargetUser] = await connection.execute(queryTargetUser, paramsTargetUser)
      const resultTargetUserArr = resultTargetUser as RowDataPacket[]

      const targetUserId = resultTargetUserArr[0].userId
      const targetUserName = resultTargetUserArr[0].userName
      const targetUserMail = resultTargetUserArr[0].userMail
      const chatRoom: T.ChatRoomType = {
        chatRoomOId,
        targetUserOId: dto.targetUserOId,
        unreadMessageCount: 0,
        targetUserId,
        targetUserMail,
        targetUserName,
        chatRoomName: targetUserName,
        lastChatDate: nowDate
      }

      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      // 리턴까지 성공하지 못하면 새로 생성했던것들을 다 지운다.
      if (isCreated) {
        try {
          const queryDeleteRoom = `DELETE FROM chatRooms WHERE chatRoomOId = ?`
          const paramsDeleteRoom = [chatRoomOId]
          await connection.execute(queryDeleteRoom, paramsDeleteRoom)

          const queryDeleteRouter = `DELETE FROM chatRoomRouters WHERE chatRoomOId = ?`
          const paramsDeleteRouter = [chatRoomOId]
          await connection.execute(queryDeleteRouter, paramsDeleteRouter)
          // ::
        } catch (errObj) {
          // ::
          console.log(`${where} 의 catch 에서 삭제 실패: ${errObj}`)

          if (typeof errObj !== 'string') {
            Object.keys(errObj).forEach(key => {
              console.log(`   ${key}: ${errObj[key]}`)
            })
          }
        }
      }

      // errno 1452: 외래키 제약조건 위배
      if (errObj.errno === 1452) {
        throw {
          gkd: {foreignKeyViolation: `외래키 제약조건 위배`, userOId: `userOId 유저가 없거나`, targetUserOId: `targetUserOId 유저가 없거나`},
          gkdErrCode: 'CHATDB_createChatRoom_1452',
          gkdErrMsg: `외래키 제약조건 위배: userOId 유저가 없거나, targetUserOId 유저가 없거나`,
          gkdStatus: {chatRoomOId, userOId: dto.userOId, targetUserOId: dto.targetUserOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async readChatArrByChatRoomOId(where: string, chatRoomOId: string, firstIdx: number) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM chats WHERE chatRoomOId = ? ORDER BY chatIdx ASC`
      const params = [chatRoomOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]
      const arrLen = resultArr.length

      let slicedArr = []

      if (firstIdx === -1) {
        slicedArr = resultArr.slice(Math.max(0, arrLen - 10), arrLen)
      } // ::
      else {
        slicedArr = resultArr.slice(Math.max(0, firstIdx - 10), firstIdx)
      }

      const chatArr: T.ChatType[] = slicedArr.map(row => {
        const {chatRoomOId, chatIdx, content, createdAt, userOId, userName} = row
        const chat: T.ChatType = {chatRoomOId, chatIdx, content, createdAt, userOId, userName}
        return chat
      })

      return {chatArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async readChatRoomArrByUserOId(where: string, userOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `
        SELECT 
          r.chatRoomOId,
          r.targetUserOId,
          r.unreadMessageCount,
          u.userId AS targetUserId,
          u.userMail AS targetUserMail,
          u.userName AS targetUserName,
          rm.lastChatDate
        FROM chatRoomRouters r
        JOIN users u 
          ON r.targetUserOId = u.userOId
        JOIN chatRooms rm 
          ON r.chatRoomOId = rm.chatRoomOId
        WHERE r.userOId = ? AND r.roomStatus = ?
      `
      const params = [userOId, CHAT_ROOM_STATUS_ACTIVE]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      const chatRoomArr: T.ChatRoomType[] = resultArr.map(row => ({
        chatRoomOId: row.chatRoomOId,
        targetUserOId: row.targetUserOId,
        unreadMessageCount: row.unreadMessageCount,
        targetUserId: row.targetUserId,
        targetUserMail: row.targetUserMail,
        targetUserName: row.targetUserName,
        chatRoomName: row.targetUserName,
        lastChatDate: row.lastChatDate
      }))

      return {chatRoomArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async readChatRoomByBothOId(where: string, userOId: string, targetUserOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `
        SELECT * FROM chatRoomRouters WHERE userOId = ? AND targetUserOId = ?
      `
      const params = [userOId, targetUserOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]
      if (resultArr.length === 0) {
        return {chatRoom: null}
      }

      const queryRoom = `SELECT lastChatDate FROM chatRooms WHERE chatRoomOId = ?`
      const paramRoom = [resultArr[0].chatRoomOId]
      const [resultRoom] = await connection.execute(queryRoom, paramRoom)
      const resultRoomArr = resultRoom as RowDataPacket[]
      const lastChatDate = resultRoomArr[0].lastChatDate

      const queryTargetUser = `SELECT userMail FROM users WHERE userOId = ?`
      const [resultTargetUser] = await connection.execute(queryTargetUser, [resultArr[0].targetUserOId])
      const resultTargetUserArr = resultTargetUser as RowDataPacket[]

      const targetUserId = resultTargetUserArr[0].userOId
      const targetUserName = resultTargetUserArr[0].userName
      const targetUserMail = resultTargetUserArr[0].userMail

      const chatRoom: T.ChatRoomType = {
        chatRoomName: resultArr[0].chatRoomName,
        chatRoomOId: resultArr[0].chatRoomOId,
        targetUserOId: resultArr[0].targetUserOId,
        lastChatDate,
        targetUserId,
        targetUserName,
        unreadMessageCount: resultArr[0].unreadMessageCount,
        targetUserMail
      }

      return {chatRoom}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async readChatRoomInfo(where: string, chatRoomOId: string) {
    const connection = await this.dbService.getConnection()

    /**
     * 리턴
     *   - numChat: 채팅방 총 메시지 갯수
     *   - refreshs: {key: 유저 OId, value: 채팅방 갱신 정보} 의 객체
     *     - 채팅방 갱신정보는 다음 정보를 갖는다.
     *       - chatRoomOId: 채팅방 OId
     *       - unreadMessageCount: 안 읽은 메시지 갯수
     */
    try {
      const query = `
        SELECT cr.numChat, r.userOId, r.unreadMessageCount
        FROM chatRooms cr
        LEFT JOIN chatRoomRouters r
          ON cr.chatRoomOId = r.chatRoomOId
        WHERE cr.chatRoomOId = ?
      `
      const [rows] = await connection.execute(query, [chatRoomOId])
      const resultArr = rows as RowDataPacket[]

      if (resultArr.length === 0) {
        throw {
          gkd: {noChatRoom: `채팅방이 없음`},
          gkdErrCode: 'CHATDB_readChatRoomInfo_noChatRoom',
          gkdErrMsg: `채팅방이 없습니다.`,
          gkdStatus: {chatRoomOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      const numChat = resultArr[0].numChat
      const refreshs: T.RefreshChatRoomsType = {}

      resultArr.forEach(row => {
        if (row.userOId) {
          refreshs[row.userOId] = {
            chatRoomOId,
            unreadMessageCount: row.unreadMessageCount
          }
        }
      })

      return {numChat, refreshs}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async updateChatRoomLast(where: string, chatRoomOId: string, lastChatDate: Date) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE chatRooms SET lastChatDate = ?, numChat = numChat + 1 WHERE chatRoomOId = ?`
      const params = [lastChatDate, chatRoomOId]
      await connection.execute(query, params)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateChatRoomUnreadCntIncrease(where: string, chatRoomOId: string, unreadUserOIdArr: string[]) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE chatRoomRouters SET unreadMessageCount = unreadMessageCount + 1, roomStatus = ? WHERE chatRoomOId = ? AND userOId IN (${unreadUserOIdArr.map(userOId => `?`).join(',')})`
      const params = [CHAT_ROOM_STATUS_ACTIVE, chatRoomOId, ...unreadUserOIdArr]
      await connection.execute(query, params)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateChatRoomUnreadCntZero(where: string, chatRoomOId: string, userOIdArr: string[]) {
    const connection = await this.dbService.getConnection()
    try {
      const query = `UPDATE chatRoomRouters SET unreadMessageCount = 0 WHERE chatRoomOId = ? AND userOId IN (${userOIdArr.map(userOId => `?`).join(',')})`
      const params = [chatRoomOId, ...userOIdArr]
      await connection.execute(query, params)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async isChatRoomUser(where: string, userOId: string, chatRoomOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM chatRoomRouters WHERE userOId = ? AND chatRoomOId = ?`
      const params = [userOId, chatRoomOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]
      return resultArr.length > 0
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
