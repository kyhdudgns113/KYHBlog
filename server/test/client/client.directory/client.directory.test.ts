/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import * as GET from './get'
import * as POST from './post'
import * as PUT from './put'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 2

export class ClientDirectoryModule extends GKDTestBase {
  // POST:
  private AddDirectoryFunction: POST.AddDirectoryFunction
  private AddFileFunction: POST.AddFileFunction

  // GET:
  private LoadRootDirectoryFunction: GET.LoadRootDirectoryFunction
  private LoadDirectoryFunction: GET.LoadDirectoryFunction

  // PUT:
  private ChangeDirNameFunction: PUT.ChangeDirNameFunction
  private ChangeFileNameFunction: PUT.ChangeFileNameFunction
  private MoveDirectoryFunction: PUT.MoveDirectoryFunction

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    // POST:
    this.AddDirectoryFunction = new POST.AddDirectoryFunction(REQUIRED_LOG_LEVEL + 1)
    this.AddFileFunction = new POST.AddFileFunction(REQUIRED_LOG_LEVEL + 1)

    // GET:
    this.LoadDirectoryFunction = new GET.LoadDirectoryFunction(REQUIRED_LOG_LEVEL + 1)
    this.LoadRootDirectoryFunction = new GET.LoadRootDirectoryFunction(REQUIRED_LOG_LEVEL + 1)

    // PUT:
    this.ChangeDirNameFunction = new PUT.ChangeDirNameFunction(REQUIRED_LOG_LEVEL + 1)
    this.ChangeFileNameFunction = new PUT.ChangeFileNameFunction(REQUIRED_LOG_LEVEL + 1)
    this.MoveDirectoryFunction = new PUT.MoveDirectoryFunction(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      // POST:
      await this.AddDirectoryFunction.testOK(db, logLevel)
      await this.AddFileFunction.testOK(db, logLevel)

      // GET::
      await this.LoadDirectoryFunction.testOK(db, logLevel)
      await this.LoadRootDirectoryFunction.testOK(db, logLevel)

      // PUT:
      await this.ChangeDirNameFunction.testOK(db, logLevel)
      await this.ChangeFileNameFunction.testOK(db, logLevel)
      await this.MoveDirectoryFunction.testOK(db, logLevel)

      const {FgGreen} = consoleColors
      this.addFinalLog(`[ClientDirectoryModule] 함수 7개 테스트 완료`, FgGreen)
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
  const testModule = new ClientDirectoryModule(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
