/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {WrongID} from './WrongID'
import {WrongName} from './WrongName'
import {WrongPW} from './WrongPW'
import {WrongMail} from './WrongMail'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * 잘못된 입력들을 받았을때를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * ------
 *
 * 서브 테스트
 *   1. 잘못된 ID
 *   2. 잘못된 이름
 *   3. 잘못된 비밀번호
 */
export class WrongInput extends GKDTestBase {
  private readonly WrongID: WrongID
  private readonly WrongMail: WrongMail
  private readonly WrongName: WrongName
  private readonly WrongPW: WrongPW

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.WrongID = new WrongID(REQUIRED_LOG_LEVEL + 1)
    this.WrongMail = new WrongMail(REQUIRED_LOG_LEVEL + 1)
    this.WrongName = new WrongName(REQUIRED_LOG_LEVEL + 1)
    this.WrongPW = new WrongPW(REQUIRED_LOG_LEVEL + 1)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.WrongID.testOK(db, logLevel)
      await this.WrongMail.testOK(db, logLevel)
      await this.WrongName.testOK(db, logLevel)
      await this.WrongPW.testOK(db, logLevel)
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
  const testModule = new WrongInput(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
