import {Module} from '@nestjs/common'
import {ScheduleModule} from '@nestjs/schedule'
import {DatabaseModule} from '@modules/database'
import {WorkerService} from './worker.service'

@Module({
  imports: [
    ScheduleModule.forRoot(), // ::

    DatabaseModule
  ],
  controllers: [],
  providers: [WorkerService],
  exports: [WorkerService]
})
export class WorkerModule {}
