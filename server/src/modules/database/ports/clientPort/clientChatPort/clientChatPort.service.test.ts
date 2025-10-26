import {DBHubServiceTest} from '../../../dbHub'
import {GKDLockTest} from '@modules/gkdLock'
import {ClientChatPortService} from './clientChatPort.service'

export class ClientChatPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService
  private static gkdLockService = GKDLockTest.lockService

  public static clientChatPortService = new ClientChatPortService(ClientChatPortServiceTest.dbHubService, ClientChatPortServiceTest.gkdLockService)
}
