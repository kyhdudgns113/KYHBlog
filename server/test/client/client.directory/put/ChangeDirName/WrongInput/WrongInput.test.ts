/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import * as SHARE from '@shareValue'
import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - client.directory 의 ChangeDirName 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 상황
 *   - 루트 폴더에 자식 폴더를 하나 직접 생성 쿼리로 만든다.
 *
 * 서브 테스트
 *   1. 이름이 없을때
 *   2. 이름이 공백으로만 이루어져 있을때
 *   3. 이름이 너무 길 때
 *   4. 이름이 부모폴더 내에서 중복될때
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory
      const dirName = this.constructor.name
      const {directory} = await this.testDB.createDirectoryLight(parentDirOId, dirName)
      this.dirOId = directory.dirOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_noName.bind(this), db, logLevel)
      await this.memberFail(this._2_emptyName.bind(this), db, logLevel)
      await this.memberFail(this._3_tooLongName.bind(this), db, logLevel)
      await this.memberFail(this._4_duplicateName.bind(this), db, logLevel)
      await this.memberFail(this._5_tryRootName.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.dirOId) {
        await this.testDB.deleteDirectoryLight(this.dirOId)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_noName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: ''})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeDirName_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_emptyName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: '  '})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeDirName_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_tooLongName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: 'a'.repeat(SHARE.DIR_NAME_MAX_LENGTH + 1)})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeDirName_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _4_duplicateName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirName} = this.testDB.getDirectory(rootDir.subDirOIdsArr[0]).directory
      await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: dirName})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_updateDirName_DuplicateDirName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _5_tryRootName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: 'root'})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeDirName_InvalidDirName') {
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
