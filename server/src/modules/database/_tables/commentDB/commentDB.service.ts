import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as DTO from '@dto'
import * as T from '@type'

@Injectable()
export class CommentDBService {
  constructor(private readonly dbService: DBService) {}

  async createComment(where: string, dto: DTO.CreateCommentDTO) {
    where = where + '/addComment'

    const {content, fileOId, userName, userOId} = dto

    const connection = await this.dbService.getConnection()

    /**
     * 1. commentOId 생성 (미중복 나올때까지 반복)
     * 2. 댓글 추가
     */

    try {
      let commentOId = generateObjectId()
      while (true) {
        const query = `SELECT commentOId FROM comments WHERE commentOId = ?`
        const [result] = await connection.execute(query, [commentOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        commentOId = generateObjectId()
      }

      const query = `INSERT INTO comments (commentOId, content, fileOId, userName, userOId) VALUES (?, ?, ?, ?, ?)`
      const params = [commentOId, content, fileOId, userName, userOId]
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
  async createReply(where: string, dto: DTO.CreateReplyDTO) {
    where = where + '/createReply'

    const {commentOId, content, targetUserOId, targetUserName, userName, userOId} = dto

    const connection = await this.dbService.getConnection()

    try {
      let replyOId = generateObjectId()
      while (true) {
        const query = `SELECT replyOId FROM replies WHERE replyOId = ?`
        const [result] = await connection.execute(query, [replyOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        replyOId = generateObjectId()
      }

      const query = `
        INSERT INTO replies (
          replyOId, commentOId, content,
          targetUserOId, targetUserName,
          userName, userOId, fileOId
        )
        SELECT ?, ?, ?, ?, ?, ?, ?, c.fileOId
        FROM comments c
        WHERE c.commentOId = ?
      `
      const params = [replyOId, commentOId, content, targetUserOId, targetUserName, userName, userOId, commentOId]
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

  async readCommentByCommentOId(where: string, commentOId: string) {
    where = where + '/readCommentByCommentOId_noReply'

    const connection = await this.dbService.getConnection()

    /**
     * commentOId 댓글의 comments 테이블 정보만 가져온다.
     *   - 대댓글은 가져오지 않는다.
     */
    try {
      const query = `SELECT * FROM comments WHERE commentOId = ?`
      const params = [commentOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {comment: null}
      }

      const {content, createdAt, fileOId, userName, userOId} = resultArr[0]

      const comment: T.CommentType = {
        commentOId,
        content,
        createdAt,
        fileOId,
        userName,
        userOId
      }
      return {comment}
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
  async readCommentReplyArrByCommentOId(where: string, commentOId: string) {
    where = where + '/readCommentReplyArrByCommentOId'

    const connection = await this.dbService.getConnection()

    /**
     * commentOId 댓글이 속한 파일의 댓글 및 대댓글을 전부 읽어온다.
     */
    try {
      const query = `
        SELECT 
          c.content AS commentContent,
          c.commentOId AS commentOId,
          c.createdAt AS commentCreatedAt,
          c.fileOId AS commentFileOId,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          r.replyOId AS replyOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.fileOId AS replyFileOId,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName,
          r.targetUserOId AS replyTargetUserOId
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.fileOId = (
          SELECT fileOId 
          FROM comments 
          WHERE commentOId = ?
        )
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [commentOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const entireCommentReplyLen = rowArr.length

      const commentReplyArr: (T.CommentType | T.ReplyType)[] = []

      let lastCommentOId: string | null = null

      rowArr.forEach(row => {
        if (row.commentOId !== lastCommentOId) {
          const comment: T.CommentType = {
            commentOId: row.commentOId,
            content: row.commentContent,
            createdAt: row.commentCreatedAt,
            fileOId: row.commentFileOId,
            userName: row.commentUserName,
            userOId: row.commentUserOId
          }
          commentReplyArr.push(comment)
          lastCommentOId = row.commentOId
        }

        if (row.replyOId) {
          const reply: T.ReplyType = {
            replyOId: row.replyOId,
            content: row.replyContent,
            createdAt: row.replyCreatedAt,
            fileOId: row.replyFileOId,
            userName: row.replyUserName,
            userOId: row.replyUserOId,
            targetUserOId: row.replyTargetUserOId,
            targetUserName: row.replyTargetUserName,
            commentOId: row.commentOId
          }
          commentReplyArr.push(reply)
        }
      })

      return {commentReplyArr, entireCommentReplyLen}
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
  async readCommentReplyArrByFileOId(where: string, fileOId: string) {
    where = where + '/readCommentReplyArrByFileOId'

    const connection = await this.dbService.getConnection()

    /**
     * fileOId 파일의 댓글 및 대댓글을 전부 읽어온다.
     */
    try {
      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          r.replyOId AS replyOId,
          r.commentOId AS replyCommentOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName,
          r.targetUserOId AS replyTargetUserOId
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.fileOId = ?
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [fileOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const entireCommentReplyLen = rowArr.length

      const commentReplyArr: (T.CommentType | T.ReplyType)[] = []

      let lastCommentOId: string | null = null

      rowArr.forEach(row => {
        if (row.commentOId !== lastCommentOId) {
          const comment: T.CommentType = {
            commentOId: row.commentOId,
            content: row.commentContent,
            createdAt: row.commentCreatedAt,
            fileOId,
            userName: row.commentUserName,
            userOId: row.commentUserOId
          }
          commentReplyArr.push(comment)
          lastCommentOId = row.commentOId
        }

        if (row.replyOId) {
          const reply: T.ReplyType = {
            replyOId: row.replyOId,
            content: row.replyContent,
            createdAt: row.replyCreatedAt,
            fileOId,
            userName: row.replyUserName,
            userOId: row.replyUserOId,
            targetUserOId: row.replyTargetUserOId,
            targetUserName: row.replyTargetUserName,
            commentOId: row.replyCommentOId
          }
          commentReplyArr.push(reply)
        }
      })

      return {commentReplyArr, entireCommentReplyLen}
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
  async readCommentReplyArrByReplyOId(where: string, replyOId: string) {
    where = where + '/readCommentReplyArrByReplyOId'

    const connection = await this.dbService.getConnection()

    /**
     * replyOId 대댓글이 속한 파일의 댓글 및 대댓글 전부를 읽어온다.
     */

    try {
      const query = `
        SELECT 
          c.commentOId AS commentOId,
          c.content AS commentContent,
          c.createdAt AS commentCreatedAt,
          c.fileOId AS commentFileOId,
          c.userName AS commentUserName,
          c.userOId AS commentUserOId,
          r.replyOId AS replyOId,
          r.commentOId AS replyCommentOId,
          r.content AS replyContent,
          r.createdAt AS replyCreatedAt,
          r.fileOId AS replyFileOId,
          r.userName AS replyUserName,
          r.userOId AS replyUserOId,
          r.targetUserName AS replyTargetUserName,
          r.targetUserOId AS replyTargetUserOId
        FROM comments c
        LEFT JOIN replies r ON c.commentOId = r.commentOId
        WHERE c.fileOId = (
          SELECT fileOId 
          FROM replies 
          WHERE replyOId = ?
        )
        ORDER BY c.createdAt ASC, r.createdAt ASC;
      `
      const params = [replyOId]
      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const entireCommentReplyLen = rowArr.length

      const commentReplyArr: (T.CommentType | T.ReplyType)[] = []

      let lastCommentOId: string | null = null

      rowArr.forEach(row => {
        if (row.commentOId !== lastCommentOId) {
          const comment: T.CommentType = {
            commentOId: row.commentOId,
            content: row.commentContent,
            createdAt: row.commentCreatedAt,
            fileOId: row.commentFileOId,
            userName: row.commentUserName,
            userOId: row.commentUserOId
          }
          commentReplyArr.push(comment)
          lastCommentOId = row.commentOId
        }

        if (row.replyOId) {
          const reply: T.ReplyType = {
            replyOId: row.replyOId,
            content: row.replyContent,
            createdAt: row.replyCreatedAt,
            fileOId: row.replyFileOId,
            userName: row.replyUserName,
            userOId: row.replyUserOId,
            targetUserOId: row.replyTargetUserOId,
            targetUserName: row.replyTargetUserName,
            commentOId: row.replyCommentOId
          }
          commentReplyArr.push(reply)
        }
      })

      return {commentReplyArr, entireCommentReplyLen}
      // ::
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
  async readReplyByReplyOId(where: string, replyOId: string) {
    where = where + '/readReplyByReplyOId'

    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM replies WHERE replyOId = ?`
      const params = [replyOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {reply: null}
      }

      const {commentOId, content, createdAt, fileOId, userName, userOId, targetUserOId, targetUserName} = resultArr[0]
      const reply: T.ReplyType = {replyOId, commentOId, content, createdAt, fileOId, userName, userOId, targetUserOId, targetUserName}
      return {reply}
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

  async updateComment(where: string, commentOId: string, newContent: string) {
    where = where + '/updateComment'

    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE comments SET content = ? WHERE commentOId = ?`
      const params = [newContent, commentOId]
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
  async updateReplyContent(where: string, replyOId: string, newContent: string) {
    where = where + '/updateReplyContent'

    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE replies SET content = ? WHERE replyOId = ?`
      const params = [newContent, replyOId]
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

  async deleteComment(where: string, commentOId: string) {
    where = where + '/deleteComment'

    const connection = await this.dbService.getConnection()

    try {
      const queryRead = `SELECT fileOId FROM comments WHERE commentOId = ?`
      const paramsRead = [commentOId]
      const [resultRead] = await connection.execute(queryRead, paramsRead)
      const resultReadArr = resultRead as RowDataPacket[]
      const {fileOId} = resultReadArr[0]

      const queryDelete = `DELETE FROM comments WHERE commentOId = ?`
      const paramsDelete = [commentOId]
      await connection.execute(queryDelete, paramsDelete)

      return {fileOId}
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

  async deleteReply(where: string, replyOId: string) {
    where = where + '/deleteReply'

    const connection = await this.dbService.getConnection()

    /**
     * replyOId 대댓글을 삭제한다.
     */
    try {
      const queryRead = `SELECT fileOId FROM replies WHERE replyOId = ?`
      const paramsRead = [replyOId]
      const [resultRead] = await connection.execute(queryRead, paramsRead)
      const resultReadArr = resultRead as RowDataPacket[]
      const {fileOId} = resultReadArr[0]

      const query = `DELETE FROM replies WHERE replyOId = ?`
      const params = [replyOId]
      await connection.execute(query, params)

      return {fileOId}
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
