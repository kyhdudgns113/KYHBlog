import {DBHubServiceTest} from '../../../dbHub'
import {ClientAuthPortService} from './clientAuthPort.service'

export class ClientAuthPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static clientAuthPortService = new ClientAuthPortService(ClientAuthPortServiceTest.dbHubService)
}
