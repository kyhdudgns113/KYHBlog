import {Module} from '@nestjs/common'
import {DBService} from './db.service'

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: DBService,
      useFactory: () => new DBService(false)
    }
  ],
  exports: [DBService]
})
export class DBModule {}
