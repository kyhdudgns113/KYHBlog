import {Injectable} from '@nestjs/common'
import {LoggerPortService} from '@modules/database'

@Injectable()
export class GKDLogService {
  constructor(private readonly portService: LoggerPortService) {}

  async loggingMessage(where: string, gkdLog: string, userOId: string, gkdStatus: any) {
    try {
      const {log} = await this.portService.loggingMessage(where, gkdLog, userOId, gkdStatus)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[GkdLogService] loggingMessage 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      // throw 는 하지 않는다.
      // throw errObj
    }
  }

  async loggingError(where: string, errObj: any, userOId: string) {
    try {
      const {log} = await this.portService.loggingError(where, errObj, userOId)
      return {log}
      // ::
    } catch (errObj) {
      // ::
      console.log(`\n[GkdLogService] loggingError 에러 발생: ${errObj}`)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      // ::
      // throw 는 하지 않는다.
      // throw errObj
    }
  }
}
