/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {ClientDirPortServiceTest} from '@modules/database'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - client.directory 의 LoadDirectory 함수의 서브 테스트 모듈
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 서브 테스트
 *   1. 존재하지 않는 디렉토리 OId 를 시도할때
 *
 * 폐기한 테스트
 *   1. 이미 지워진 디렉토리의 OId 를 시도할때
 *     - 이게 읽어진다는건 삭제가 이상한거다.
 *     - 불러오기가 이상한게 아니다
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_TestNotExist.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }

  private async _1_TestNotExist(db: mysql.Pool, logLevel: number) {
    try {
      const dirOId = '123456781234567812345678'

      await this.portService.loadDirectory(dirOId)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_loadDirectory_InvalidDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WrongInput(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
