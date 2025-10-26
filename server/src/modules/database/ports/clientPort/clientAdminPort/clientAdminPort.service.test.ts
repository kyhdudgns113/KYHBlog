import {DBHubServiceTest} from '../../../dbHub'
import {ClientAdminPortService} from './clientAdminPort.service'

export class ClientAdminPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static clientAuthPortService = new ClientAdminPortService(ClientAdminPortServiceTest.dbHubService)
}
