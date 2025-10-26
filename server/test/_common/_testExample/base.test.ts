/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import * as mysql from 'mysql2/promise'
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '..'
import {TestModuleFail, TestModuleFail2, TestModuleOK} from './tests'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 0

export class BaseExampleTest extends GKDTestBase {
  private testModuleOK: TestModuleOK
  private testModuleFail: TestModuleFail
  private testModuleFail2: TestModuleFail2

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.testModuleOK = new TestModuleOK(REQUIRED_LOG_LEVEL + 1)
    this.testModuleFail = new TestModuleFail(REQUIRED_LOG_LEVEL + 1)
    this.testModuleFail2 = new TestModuleFail2(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage(`baseTest 에서 DB 설정 완료`, 0)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      // 멤버함수 실행하는 부분
      await this._testOK1(db, logLevel)
      await this.memberOK(this._testOK2.bind(this), db, logLevel)
      await this.memberFail(this._testFail.bind(this), db, logLevel)

      // 테스트 모듈 실행하는 부분
      await this.testModuleOK.testOK(db, logLevel)
      await this.testModuleFail.testFail(db, logLevel)
      await this.testModuleFail2.testOK(db, logLevel) // 이거 실행되면 테스트는 실패한다.
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage(`baseTest 에서 DB 원상복구 완료`)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _testOK1(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage(`testOK1 이 성공적으로 완료`, 1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _testOK2(db: mysql.Pool, logLevel: number) {
    try {
      this.logMessage(`testOK2 가가 성공적으로 완료`, 2)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _testFail(db: mysql.Pool, logLevel: number) {
    try {
      throw `아무 에러나 투척`
      // ::
    } catch (errObj) {
      // ::
      this.logMessage(`_testFail 에서 성공적으로 에러 투척`, 2)
      throw errObj
    }
  }
}
if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new BaseExampleTest(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit())
}
