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
 *   - ClientDirectoryPort 의 deleteFile 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 테스트 준비
 *   - 루트 폴더에 파일을 하나 light 버전으로 생성한다.
 *   - 이 파일에 대해 시도한다.
 *
 * 서브 테스트
 *   1. 존재하지 않는 파일을 지우려는 경우
 *   2. 이미 지워진 파일을 지우려는 경우
 *     - 준비단계에서 만든 파일을 지운다.
 *     - 따라서 이 테스트는 가장 마지막에 실행되어야 한다.
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private fileOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId} = this.testDB.getRootDir().directory
      const fileName = this.constructor.name
      const {file} = await this.testDB.createFileLight(dirOId, fileName)
      this.fileOId = file.fileOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_TestInvalidFileOId.bind(this), db, logLevel)
      await this.memberFail(this._2_TestDeletedFile.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.fileOId) {
        await this.testDB.deleteFileLight(this.fileOId)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_TestInvalidFileOId(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.deleteFile(jwtPayload, '12345678'.repeat(3))
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_deleteFile_InvalidFileOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_TestDeletedFile(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      // 먼저 파일을 삭제한다.
      await this.portService.deleteFile(jwtPayload, this.fileOId)
      // 이미 삭제된 파일을 다시 삭제하려고 시도한다.
      await this.portService.deleteFile(jwtPayload, this.fileOId)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_deleteFile_InvalidFileOId') {
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
