import {DBHubService} from '../../dbHub'
import {Injectable} from '@nestjs/common'

@Injectable()
export class WorkerPortService {
  constructor(private readonly dbHubService: DBHubService) {}

  async cleaningLog(deleteDateBefore: Date) {
    const where = `/worker/cleaningLog`

    try {
      await this.dbHubService.deleteLogDateBefore(where, deleteDateBefore)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
