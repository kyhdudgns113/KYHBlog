import {Injectable} from '@nestjs/common'
import {Cron} from '@nestjs/schedule'
import {WorkerPortService} from '@modules/database'

@Injectable()
export class WorkerService {
  constructor(private readonly workerPortService: WorkerPortService) {}

  @Cron('0 * * * * *', {
    timeZone: 'Asia/Seoul'
  })
  everyMinute() {
    const now = new Date()
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')

    console.log(`[Worker Clock]: ${hour}:${minute}`)
  }

  @Cron(`1 0 * * * *`, {
    timeZone: 'Asia/Seoul'
  })
  async cleaningLog() {
    const now = new Date()
    const deltaDate = 7
    const deleteDateBefore = new Date(now.getTime() - deltaDate * 24 * 60 * 60 * 1000)
    process.stdout.write(`[Worker Cleaning Log]: 오래된 로그 메시지를 삭제중입니다...`)

    try {
      await this.workerPortService.cleaningLog(deleteDateBefore)
      process.stdout.write(` 성공했습니다.\n`)
      // ::
    } catch (errObj) {
      // ::
      process.stdout.write(` 실패했습니다.\n`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
    }
  }
}
