/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import * as mysql from 'mysql2/promise'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '../..'

/**
 * 깊이가 1 늘어났으므로 1로 해준다.
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 1

export class TestModuleFail2 extends GKDTestBase {
  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage('모듈 FAIL2 에서 DB 를 초기화 했습니다.', 1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      throw '아무 에러'
      // ::
    } catch (errObj) {
      // ::
      this.logMessage('모듈 FAIL2 이 실패하여여 에러를 받았습니다.', 1)
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage('모듈 FAIL2 에서 DB 를 원상복구 했습니다.', 1)
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
  const testModule = new TestModuleFail2(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
