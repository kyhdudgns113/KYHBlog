/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import {CheckAuth} from './CheckAuth/CheckAuth.test'
import {WrongInput} from './WrongInput/WrongInput.test'
import {WorkingScenario} from './WorkingScenario/WorkingScenario.test'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

export class LoadCommentsFunction extends GKDTestBase {
  private CheckAuth: CheckAuth
  private WrongInput: WrongInput
  private WorkingScenario: WorkingScenario

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.CheckAuth = new CheckAuth(REQUIRED_LOG_LEVEL + 1)
    this.WrongInput = new WrongInput(REQUIRED_LOG_LEVEL + 1)
    this.WorkingScenario = new WorkingScenario(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.CheckAuth.testOK(db, logLevel)
      await this.WrongInput.testOK(db, logLevel)
      await this.WorkingScenario.testOK(db, logLevel)
      this.addFinalLog(`[LoadCommentsFunction] 테스트 작성 안됨`, consoleColors.FgYellow)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new LoadCommentsFunction(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
