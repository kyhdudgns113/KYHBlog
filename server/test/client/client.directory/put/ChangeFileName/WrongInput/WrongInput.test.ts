/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_ADMIN} from '@secret'
import * as HTTP from '@httpDataType'
import * as SHARE from '@shareValue'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - ClientDirectoryPort 의 changeFileName 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 상황
 *   - 루트 폴더에 파일 2개를 직접 생성 쿼리로 만든다.
 *   - 이 중 첫번째 파일에 대해 시도한다.
 *
 * 서브 테스트
 *   1. 이름이 없을때
 *   2. 이름이 공백으로만 이루어져 있을때
 *   3. 이름이 너무 길 때
 *   4. 이름이 부모폴더 내에서 중복될때
 *   5. 없는 파일에 대해 시도할때
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private fileOId: string = ''
  private fileOId2: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId} = this.testDB.getRootDir().directory
      const fileName = this.constructor.name
      const {file} = await this.testDB.createFileLight(dirOId, 'testFileName')
      const {file: file2} = await this.testDB.createFileLight(dirOId, fileName)
      this.fileOId = file.fileOId
      this.fileOId2 = file2.fileOId
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
      await this.memberFail(this._5_tryingNotExistFile.bind(this), db, logLevel)
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
      if (this.fileOId2) {
        await this.testDB.deleteFileLight(this.fileOId2)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_noName() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId, fileName: ''}
      await this.portService.changeFileName(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeFileName_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_emptyName() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId, fileName: '  '}
      await this.portService.changeFileName(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeFileName_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_tooLongName() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId, fileName: 'a'.repeat(SHARE.FILE_NAME_MAX_LENGTH + 1)}
      await this.portService.changeFileName(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_changeFileName_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _4_duplicateName() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId, fileName: this.constructor.name}
      await this.portService.changeFileName(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_updateFileName_DuplicateFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _5_tryingNotExistFile() {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const data: HTTP.ChangeFileNameType = {fileOId: '123456781234567812345678', fileName: this.constructor.name}
      await this.portService.changeFileName(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_updateFileName_InvalidFileOId') {
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
