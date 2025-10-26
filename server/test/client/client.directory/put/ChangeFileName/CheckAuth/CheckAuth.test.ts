/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_GUEST, AUTH_USER} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * CheckAuth
 *   - ClientDirectoryPort 의 changeFileName 함수 실행을 테스트한다.
 *   - 권한이 없는 유저들이 시도하는 경우를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 상황
 *   - 루트 폴더에 파일을 하나 직접 생성 쿼리로 만든다.
 *   - 이 파일에 대해 시도한다.
 *
 * 서브 테스트
 *   1. 권한이 ADMIN_GUEST 인 경우
 *   2. 권한이 ADMIN_USER 인 경우
 */
export class CheckAuth extends GKDTestBase {
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
      await this.memberFail(this._testAdminGuest.bind(this), db, logLevel)
      await this.memberFail(this._testAdminUser.bind(this), db, logLevel)
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

  private async _testAdminGuest() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_GUEST)
      const fileName = this.constructor.name
      await this.portService.changeFileName(jwtPayload, {fileOId: this.fileOId, fileName})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _testAdminUser() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      const fileName = this.constructor.name
      await this.portService.changeFileName(jwtPayload, {fileOId: this.fileOId, fileName})
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
  const testModule = new CheckAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
