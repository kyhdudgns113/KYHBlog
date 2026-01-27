import {AlarmDBServiceTest} from '../_tables/alarmDB'
import {ChatDBServiceTest} from '../_tables/chatDB'
import {CommentDBServiceTest} from '../_tables/commentDB'
import {DirectoryDBServiceTest} from '../_tables/directoryDB'
import {FileDBServiceTest} from '../_tables/fileDB'
import {LogDBServiceTest} from '../_tables/logDB'
import {QnaDBServiceTest} from '../_tables/qnaDB'
import {UserDBServiceTest} from '../_tables/userDB'
import {DBHubService} from './dbHub.service'

export class DBHubServiceTest {
  private static alarmDBService = AlarmDBServiceTest.alarmDBService
  private static chatDBService = ChatDBServiceTest.chatDBService
  private static commentDBService = CommentDBServiceTest.commentDBService
  private static directoryDBService = DirectoryDBServiceTest.directoryDBService
  private static fileDBService = FileDBServiceTest.fileDBService
  private static logDBService = LogDBServiceTest.logDBService
  private static qnaDBService = QnaDBServiceTest.qnaDBService
  private static userDBService = UserDBServiceTest.userDBService

  public static dbHubService = new DBHubService(
    DBHubServiceTest.alarmDBService,
    DBHubServiceTest.chatDBService,
    DBHubServiceTest.commentDBService,
    DBHubServiceTest.directoryDBService,
    DBHubServiceTest.fileDBService,
    DBHubServiceTest.logDBService,
    DBHubServiceTest.qnaDBService,
    DBHubServiceTest.userDBService
  )
}
