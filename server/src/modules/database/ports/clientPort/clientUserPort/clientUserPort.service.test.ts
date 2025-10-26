import {DBHubServiceTest} from '../../../dbHub'
import {ClientUserPortService} from './clientUserPort.service'

export class ClientUserPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static clientUserPortService = new ClientUserPortService(ClientUserPortServiceTest.dbHubService)
}
