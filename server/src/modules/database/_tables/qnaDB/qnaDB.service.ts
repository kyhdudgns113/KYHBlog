import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as DTO from '@dto'
import * as T from '@type'

@Injectable()
export class QnaDBService {
  constructor(private readonly dbService: DBService) {}

  async createQnA(where: string, dto: DTO.CreateQnADTO) {
    where = where + '/createQnA'

    const {title, content, isPrivate, userName, userOId} = dto

    const connection = await this.dbService.getConnection()

    /**
     * 1. qnAOId 생성 (미중복 나올때까지 반복)
     * 2. QnA 추가
     * 3. 생성된 QnA 반환
     */

    try {
      // 1. qnAOId 생성 (미중복 나올때까지 반복)
      let qnAOId = generateObjectId()
      while (true) {
        const query = `SELECT qnAOId FROM qnas WHERE qnAOId = ?`
        const [result] = await connection.execute(query, [qnAOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        qnAOId = generateObjectId()
      }

      await new Promise(resolve => setTimeout(resolve, 1))

      // 2. QnA 추가
      const query = `INSERT INTO qnas (qnAOId, title, content, isPrivate, userName, userOId) VALUES (?, ?, ?, ?, ?, ?)`
      const params = [qnAOId, title, content, isPrivate ? 1 : 0, userName, userOId]
      await connection.execute(query, params)

      // 3. 생성된 QnA 반환
      const queryRead = `SELECT * FROM qnas WHERE qnAOId = ?`
      const [resultRead] = await connection.execute(queryRead, [qnAOId])
      const resultReadArr = resultRead as RowDataPacket[]

      if (resultReadArr.length === 0) {
        throw {
          gkd: {qnAOId: `QnA 생성 실패`},
          gkdErrCode: 'QNADB_createQnA_Failed',
          gkdErrMsg: `QnA 생성 실패`,
          gkdStatus: {qnAOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const row = resultReadArr[0]
      const qnA: T.QnAType = {
        qnAOId: row.qnAOId,
        title: row.title,
        content: row.content,
        isPrivate: row.isPrivate === 1,
        userName: row.userName,
        userOId: row.userOId,
        viewCount: row.viewCount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }

      return {qnA}
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

  async readQnAByQnAOId(where: string, qnAOId: string) {
    where = where + '/readQnAByQnAOId'

    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM qnas WHERE qnAOId = ?`
      const params = [qnAOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {qnA: null}
      }

      const row = resultArr[0]
      const qnA: T.QnAType = {
        qnAOId: row.qnAOId,
        title: row.title,
        content: row.content,
        isPrivate: row.isPrivate === 1,
        userName: row.userName,
        userOId: row.userOId,
        viewCount: row.viewCount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }

      return {qnA}
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

  async readQnAArr(where: string, userOId?: string) {
    where = where + '/readQnAArr'

    const connection = await this.dbService.getConnection()

    /**
     * QnA 목록을 읽어온다.
     * - userOId가 제공되면 해당 사용자의 QnA만 반환 (비공개 포함)
     * - userOId가 없으면 공개 QnA만 반환
     */
    try {
      let query: string
      let params: any[]

      if (userOId) {
        query = `SELECT * FROM qnas WHERE userOId = ? ORDER BY createdAt DESC`
        params = [userOId]
      } // ::
      else {
        query = `SELECT * FROM qnas WHERE isPrivate = 0 ORDER BY createdAt DESC`
        params = []
      }

      const [result] = await connection.execute(query, params)
      const rowArr = result as RowDataPacket[]

      const qnAArr: T.QnAType[] = rowArr.map(row => ({
        qnAOId: row.qnAOId,
        title: row.title,
        content: row.content,
        isPrivate: row.isPrivate === 1,
        userName: row.userName,
        userOId: row.userOId,
        viewCount: row.viewCount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }))

      return {qnAArr}
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

  async updateQnA(where: string, qnAOId: string, title?: string, content?: string, isPrivate?: boolean) {
    where = where + '/updateQnA'

    const connection = await this.dbService.getConnection()

    try {
      const updateFields: string[] = []
      const params: any[] = []

      if (title !== undefined) {
        updateFields.push('title = ?')
        params.push(title)
      }

      if (content !== undefined) {
        updateFields.push('content = ?')
        params.push(content)
      }

      if (isPrivate !== undefined) {
        updateFields.push('isPrivate = ?')
        params.push(isPrivate ? 1 : 0)
      }

      if (updateFields.length === 0) {
        throw {
          gkd: {updateFields: `수정할 필드가 없음`},
          gkdErrCode: 'QNADB_updateQnA_NoUpdateFields',
          gkdErrMsg: `수정할 필드가 없음`,
          gkdStatus: {qnAOId},
          statusCode: 400,
          where
        } as T.ErrorObjType
      }

      params.push(qnAOId)
      const query = `UPDATE qnas SET ${updateFields.join(', ')} WHERE qnAOId = ?`
      await connection.execute(query, params)

      // 업데이트된 QnA 반환
      const {qnA} = await this.readQnAByQnAOId(where, qnAOId)
      return {qnA}
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

  async deleteQnA(where: string, qnAOId: string) {
    where = where + '/deleteQnA'

    const connection = await this.dbService.getConnection()

    try {
      const query = `DELETE FROM qnas WHERE qnAOId = ?`
      const params = [qnAOId]
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

  async incrementViewCount(where: string, qnAOId: string) {
    where = where + '/incrementViewCount'

    const connection = await this.dbService.getConnection()

    try {
      const query = `UPDATE qnas SET viewCount = viewCount + 1 WHERE qnAOId = ?`
      const params = [qnAOId]
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
}
