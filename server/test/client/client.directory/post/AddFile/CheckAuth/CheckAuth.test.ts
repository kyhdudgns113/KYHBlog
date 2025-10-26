/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_GUEST, AUTH_USER} from '@secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {RESET_FLAG_DIR, RESET_FLAG_FILE} from '@testValue'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * ClientDirectoryPort 의 addFile 함수 실행을 테스트한다.
 *   - 토큰 인증 실패 케이스들을 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 상황
 *   - 루트 폴더에서 실행한다.
 *
 * 서브 테스트
 *   1. AUTH_GUEST
 *   2. AUTH_USER
 */
export class CheckAuth extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private fileOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_try_AUTH_GUEST.bind(this), db, logLevel)
      await this.memberFail(this._2_try_AUTH_USER.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()

    try {
      const {fileOId} = this

      if (fileOId) {
        const query = `DELETE FROM files WHERE fileOId = ?`
        const param = [fileOId]

        await connection.execute(query, param)

        const resetMode = RESET_FLAG_DIR | RESET_FLAG_FILE
        await this.testDB.resetBaseDB(resetMode)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  private async _1_try_AUTH_GUEST(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_GUEST)
      const {dirOId} = this.testDB.getRootDir().directory

      const fileName = this.constructor.name

      const data: HTTP.AddFileType = {dirOId, fileName}

      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows

      const fileOId = fileOIdsArr.filter(_fileOId => fileRows[_fileOId].fileName === fileName)[0]

      this.fileOId = fileOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_try_AUTH_USER(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)
      const {dirOId} = this.testDB.getRootDir().directory

      const fileName = this.constructor.name

      const data: HTTP.AddFileType = {dirOId, fileName}

      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows

      const fileOId = fileOIdsArr.filter(_fileOId => fileRows[_fileOId].fileName === fileName)[0]

      this.fileOId = fileOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
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
