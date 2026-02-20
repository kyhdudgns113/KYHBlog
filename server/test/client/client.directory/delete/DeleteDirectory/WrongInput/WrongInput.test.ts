/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - ClientDirectoryPort 의 deleteDirectory 함수 실행을 테스트한다.
 *   - 잘못된 입력을 시도하는 경우를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 서브 테스트
 *   1. 존재하지 않는 디렉토리를 지우려는 경우
 *   2. 루트 디렉토리를 지우려는 경우
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private isError: boolean = false

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {}
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_TestInvalidDirOId.bind(this), db, logLevel)
      await this.memberFail(this._2_TestRootDir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.isError) {
        const errMsg = `[DeleteDirectory] WrongInput: _2_TestRootDir 가 실패하면 나머지 테스트를 진행할 수 없다.`
        this.addFinalLog(errMsg, consoleColors.FgRed)
        throw new Error(errMsg)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_TestInvalidDirOId(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.deleteDirectory(jwtPayload, '12345678'.repeat(3))
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_deleteDir_DirectoryNotFound') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_TestRootDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this.testDB.getRootDir().directory
      await this.portService.deleteDirectory(jwtPayload, dirOId)
      this.isError = true
      // ::
    } catch (errObj) {
      // ::
      // 루트 폴더의 부모폴더가 존재하지 않으므로 이 에러가 뜬다.
      if (errObj.gkdErrCode !== 'DIRECTORYDB_deleteDir_ParentDirectoryNotFound') {
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
