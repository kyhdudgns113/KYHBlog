/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import {ClientAuthModule} from './client.auth'
import {ClientChatModule} from './client.chat'
import {ClientDirectoryModule} from './client.directory'

import * as mysql from 'mysql2/promise'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 1

export class ClientModule extends GKDTestBase {
  private readonly clientAuthModule: ClientAuthModule
  private readonly clientChatModule: ClientChatModule
  private readonly clientDirectoryModule: ClientDirectoryModule

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.clientAuthModule = new ClientAuthModule(REQUIRED_LOG_LEVEL + 1)
    this.clientChatModule = new ClientChatModule(REQUIRED_LOG_LEVEL + 1)
    this.clientDirectoryModule = new ClientDirectoryModule(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.clientAuthModule.testOK(db, logLevel)
      await this.clientChatModule.testOK(db, logLevel)
      await this.clientDirectoryModule.testOK(db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {}
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new ClientModule(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
