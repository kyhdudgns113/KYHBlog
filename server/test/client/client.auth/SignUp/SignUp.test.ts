/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'

import {WrongInput} from './WrongInput'
import {SuccessCases} from './SuccessCases'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

/**
 * ClientAuthPort 의 signUp 함수를 테스트한다.
 *
 * ------
 *
 * 서브 테스트 모듈
 * 1. 잘못된 입력
 * 2. 성공 케이스
 */
export class SignUpFunction extends GKDTestBase {
  private readonly WrongInput: WrongInput
  private readonly SuccessCases: SuccessCases

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.WrongInput = new WrongInput(REQUIRED_LOG_LEVEL + 1)
    this.SuccessCases = new SuccessCases(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.WrongInput.testOK(db, logLevel)
      await this.SuccessCases.testOK(db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new SignUpFunction(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
