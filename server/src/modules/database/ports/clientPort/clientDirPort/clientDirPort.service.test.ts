import {DBHubServiceTest} from '../../../dbHub'
import {ClientDirPortService} from './clientDirPort.service'

export class ClientDirPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static clientDirPortService = new ClientDirPortService(ClientDirPortServiceTest.dbHubService)
}
