import {DBHubServiceTest} from '../../../dbHub'
import {ClientFilePortService} from './clientFilePort.service'

export class ClientFilePortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static clientFilePortService = new ClientFilePortService(ClientFilePortServiceTest.dbHubService)
}
