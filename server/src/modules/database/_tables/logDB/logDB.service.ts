import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as T from '@type'
import * as DTO from '@dto'

@Injectable()
export class LogDBService {
  constructor(private readonly dbService: DBService) {}

  async createLog(_where: string, dto: DTO.CreateLogDTO) {
    _where = _where + '/createLog'

    const {errObj, gkd, gkdErrCode, gkdErrMsg, gkdStatus, gkdLog, userId, userName, userOId, where} = dto

    const connection = await this.dbService.getConnection()

    try {
      let logOId = generateObjectId()
      while (true) {
        const query = `SELECT logOId FROM logs WHERE logOId = ?`
        const [result] = await connection.execute(query, [logOId])
        const resultArr = result as RowDataPacket[]
        if (resultArr.length === 0) break
        logOId = generateObjectId()
      }

      const date = new Date()

      const queryLog =
        'INSERT INTO `logs` (logOId, date, gkdErrCode, gkdErrMsg, gkdLog, userId, userName, userOId, `where`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      const paramsLog = [logOId, date, gkdErrCode, gkdErrMsg, gkdLog, userId, userName, userOId, where]
      await connection.execute(queryLog, paramsLog)

      // errObj 삽입
      if (errObj && Object.keys(errObj).length > 0) {
        const entries = Object.entries(errObj) // [[key1, value1], [key2, value2], ...]
        const queryErrobj = `
          INSERT INTO errobjs (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsErrobj = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryErrobj, paramsErrobj)
      }

      // gkd 삽입
      if (gkd && Object.keys(gkd).length > 0) {
        const entries = Object.entries(gkd)
        const queryGkd = `
          INSERT INTO gkds (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsGkd = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryGkd, paramsGkd)
      }

      // gkdStatus 삽입
      if (gkdStatus && Object.keys(gkdStatus).length > 0) {
        const entries = Object.entries(gkdStatus)
        const queryGkdStatus = `
          INSERT INTO gkdStatus (logOId, \`key\`, \`value\`)
          VALUES ${entries.map(() => '(?, ?, ?)').join(', ')}
        `
        const paramsGkdStatus = entries.flatMap(([key, value]) => [logOId, key, value])
        await connection.execute(queryGkdStatus, paramsGkdStatus)
      }

      const log: T.LogType = {
        logOId,
        date,
        errObj,
        gkd,
        gkdErrCode,
        gkdErrMsg,
        gkdLog,
        gkdStatus,
        userId,
        userName,
        userOId,
        where
      }

      return {log}
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

  async readLogEntire(where: string) {
    where = where + '/readLogEntire'

    const connection = await this.dbService.getConnection()
    try {
      const query = `
        SELECT 
          l.logOId, l.date, l.userId, l.userName, l.userOId, l.gkdLog, l.gkdErrCode, l.gkdErrMsg, l.\`where\`,
          e.key AS errKey, e.value AS errValue,
          g.key AS gkdKey, g.value AS gkdValue,
          s.key AS statusKey, s.value AS statusValue
        FROM \`logs\` l
        LEFT JOIN errobjs e ON e.logOId = l.logOId
        LEFT JOIN gkds g ON g.logOId = l.logOId
        LEFT JOIN gkdStatus s ON s.logOId = l.logOId
        ORDER BY l.date DESC
      `
      const [rows] = await connection.execute(query, [])
      const resultArr = rows as any[]

      const logArr: T.LogType[] = []

      resultArr.forEach(row => {
        const {logOId, date, userId, userName, userOId, gkdLog, gkdErrCode, gkdErrMsg, where} = row

        // 처음 생긴 logOId 이면 추가해준다.
        if (logArr.length === 0 || logArr[logArr.length - 1].logOId !== logOId) {
          const log: T.LogType = {
            logOId,
            date,
            userId,
            userName,
            userOId,
            gkdLog,
            gkdErrCode,
            gkdErrMsg,
            where,
            errObj: {},
            gkd: {},
            gkdStatus: {}
          }
          logArr.push(log)
        }

        const lastLog = logArr[logArr.length - 1]

        lastLog.errObj[row.errKey] = row.errValue
        lastLog.gkd[row.gkdKey] = row.gkdValue
        lastLog.gkdStatus[row.statusKey] = row.statusValue
      })

      return {logArr}
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

  async deleteLogDateBefore(where: string, deleteDateBefore: Date) {
    where = where + '/deleteLogDateBefore'

    const connection = await this.dbService.getConnection()
    try {
      const query = `DELETE FROM logs WHERE date < ?`
      const params = [deleteDateBefore]
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
