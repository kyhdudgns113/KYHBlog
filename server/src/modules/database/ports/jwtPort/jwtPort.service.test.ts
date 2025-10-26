import {DBHubServiceTest} from '../../dbHub'
import {JwtPortService} from './jwtPort.service'

export class JwtPortServiceTest {
  private static dbHubService = DBHubServiceTest.dbHubService

  public static jwtPortService = new JwtPortService(JwtPortServiceTest.dbHubService)
}
