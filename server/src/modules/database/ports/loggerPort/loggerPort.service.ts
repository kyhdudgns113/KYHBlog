import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'

import * as DTO from '@dto'
import * as HTTP from '@httpDataType'
import * as T from '@type'
import * as U from '@util'
import * as V from '@value'

@Injectable()
export class LoggerPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  async loggingMessage(where: string, gkdLog: string, userOId: string, gkdStatus: any) {
    where = where + '/loggingMessage'
    try {
      const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

      if (!user) {
        throw {
          gkd: {noUser: `유저가 없음`},
          gkdErrCode: 'LOGGERPORT_loggingMessage_noUser',
          gkdErrMsg: `유저가 없습니다.`,
          gkdStatus: {userOId},
          statusCode: 500,
          where
        } as T.ErrorObjType
      }

      const {userId, userName} = user

      const dto: DTO.CreateLogDTO = {
        errObj: {},
        gkd: {},
        gkdErrCode: '',
        gkdErrMsg: '',
        userId,
        userName,
        gkdLog,
        userOId,
        gkdStatus,
        where
      }
      const {log} = await this.dbHubService.createLog(where, dto)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async loggingError(where: string, errObj: any, userOId: string) {
    where = where + '/loggingError'
    try {
      let userId = 'NULL'
      let userName = 'NULL'

      if (userOId) {
        const {user} = await this.dbHubService.readUserByUserOId(where, userOId)

        if (!user) {
          throw {
            gkd: {noUser: `유저가 없음`},
            gkdErrCode: 'LOGGERPORT_loggingError_noUser',
            gkdErrMsg: `유저가 없습니다.`,
            gkdStatus: {userOId},
            statusCode: 500,
            where
          } as T.ErrorObjType
        }

        userId = user.userId
        userName = user.userName
      }

      const dto: DTO.CreateLogDTO = {
        errObj,
        gkd: errObj.gkd || {},
        gkdErrCode: errObj.gkdErrCode || '',
        gkdErrMsg: errObj.gkdErrMsg || '',
        userId,
        userName,
        gkdStatus: errObj.gkdStatus || {},
        gkdLog: errObj.gkdLog || '',
        userOId,
        where: errObj.where || ''
      }
      const {log} = await this.dbHubService.createLog(where, dto)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
