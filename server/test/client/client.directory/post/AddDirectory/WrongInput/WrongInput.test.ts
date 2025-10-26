/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'

import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'
import {RESET_FLAG_DIR, RESET_FLAG_FILE} from '@testValue'
import {DIR_NAME_MAX_LENGTH} from '@commons/values'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * clientDirectoryPort 의 AddDirectory 함수 테스트
 *   - 입력값이 잘못되었을때를 테스트한다.
 *   - 여러 서브 테스트를 통과해야 하므로 TestOK 로 실행한다.
 *
 * 상황
 *   - 루트 디렉토리에 잘못된 입력으로 새로운 디렉토리를 생성한다
 *
 * 서브 테스트
 *   1. 이름이 없을때
 *   2. 이름이 공백으로만 이루어져 있을때
 *   3. 이름이 너무 길 때
 *   4. 이름이 중복될때
 *   5. root 이름으로 만드려고 할 때
 *   6. 부모 폴더가 없는 경우
 *   7. parentDirOId 가 null 인 경우
 *   8. parentDirOId 가 빈 칸일 경우
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_noName.bind(this), db, logLevel)
      await this.memberFail(this._2_emptyName.bind(this), db, logLevel)
      await this.memberFail(this._3_tooLongName.bind(this), db, logLevel)
      await this.memberFail(this._4_duplicateName.bind(this), db, logLevel)
      await this.memberFail(this._5_rootName.bind(this), db, logLevel)
      await this.memberFail(this._6_noParentDir.bind(this), db, logLevel)
      await this.memberFail(this._7_nullParentDir.bind(this), db, logLevel)
      await this.memberFail(this._8_emptyParentDir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await db.getConnection()
    try {
      if (this.dirOId) {
        const query = `DELETE FROM directories WHERE dirOId = ?`
        await connection.execute(query, [this.dirOId])

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

  private async _1_noName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory

      const dirName = ''

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)

      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_emptyName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory

      const dirName = ' '

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _3_tooLongName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory

      const dirName = 'a'.repeat(DIR_NAME_MAX_LENGTH + 1)

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidDirNameLength') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _4_duplicateName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirOId: parentDirOId} = rootDir
      const {dirName: dir0Name} = this.testDB.getDirectory(rootDir.subDirOIdsArr[0]).directory

      const dirName = dir0Name

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_createDir_DuplicateDirName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _5_rootName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirOId: parentDirOId} = rootDir

      const dirName = 'root'

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidDirName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _6_noParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const parentDirOId = '123456781234567812345678'

      const dirName = 'test'

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_createDir_InvalidParentDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _7_nullParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const parentDirOId = null

      const dirName = 'test'

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidParentDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _8_emptyParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const parentDirOId = ''

      const dirName = 'test'

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addDirectory_InvalidParentDirOId') {
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
