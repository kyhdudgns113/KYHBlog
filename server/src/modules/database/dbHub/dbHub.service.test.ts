import {AlarmDBServiceTest} from '../_tables/alarmDB'
import {ChatDBServiceTest} from '../_tables/chatDB'
import {CommentDBServiceTest} from '../_tables/commentDB'
import {DirectoryDBServiceTest} from '../_tables/directoryDB'
import {FileDBServiceTest} from '../_tables/fileDB'
import {LogDBServiceTest} from '../_tables/logDB'
import {UserDBServiceTest} from '../_tables/userDB'
import {DBHubService} from './dbHub.service'

export class DBHubServiceTest {
  private static alarmDBService = AlarmDBServiceTest.alarmDBService
  private static chatDBService = ChatDBServiceTest.chatDBService
  private static commentDBService = CommentDBServiceTest.commentDBService
  private static dirDBService = DirectoryDBServiceTest.directoryDBService
  private static fileDBService = FileDBServiceTest.fileDBService
  private static logDBService = LogDBServiceTest.logDBService
  private static userDBService = UserDBServiceTest.userDBService

  public static dbHubService = new DBHubService(
    DBHubServiceTest.alarmDBService,
    DBHubServiceTest.chatDBService,
    DBHubServiceTest.commentDBService,
    DBHubServiceTest.dirDBService,
    DBHubServiceTest.fileDBService,
    DBHubServiceTest.logDBService,
    DBHubServiceTest.userDBService
  )
}
