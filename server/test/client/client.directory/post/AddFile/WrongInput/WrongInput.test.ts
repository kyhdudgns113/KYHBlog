/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_ADMIN} from '@secret'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {FILE_NAME_MAX_LENGTH} from '@shareValue'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * ClientDirectoryPort 의 addFile 함수 실행을 테스트한다.
 *   - 잘못된 입력 케이스들을 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 상황
 *   - 임의의 폴더릃 하나 만들고 그 폴더 내에서 실행한다.
 *
 * 서브 테스트
 *   1. 이름의 길이가 0 인 경우
 *   2. 이름이 공백으로만 이루어진 경우
 *   3. 이름이 너무 긴 경우
 *   4. 이름이 중복된 경우
 *   5. dirOId 가 null 인 경우
 *   6. 부모 디렉토리가 없는 경우
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = '00000000' + '0000000' + '12345678'
  private fileOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    /**
     * 루트 폴더에 임의의 폴더를 하나 만든다.
     */
    const connection = await db.getConnection()
    try {
      const {dirOId: parentDirOId} = this.testDB.getRootDir().directory
      const dirName = this.constructor.name
      const {dirOId} = this
      const dirIdx = 3

      const query = `INSERT INTO directories (dirIdx, dirOId, dirName, parentDirOId) VALUES (?, ?, ?, ?)`
      const param = [dirIdx, dirOId, dirName, parentDirOId]

      await connection.execute(query, param)
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
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_noName.bind(this), db, logLevel)
      await this.memberFail(this._2_emptyName.bind(this), db, logLevel)
      await this.memberFail(this._3_tooLongName.bind(this), db, logLevel)
      await this.memberFail(this._4_duplicateName.bind(this), db, logLevel)
      await this.memberFail(this._5_nullDirOId.bind(this), db, logLevel)
      await this.memberFail(this._6_noParentDir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    /**
     * file 의 dirOId 에 대해 ON DELETE 가 CASCADE 이다.
     *   - 생성된 파일은 알아서 지워진다.
     *
     * 새로운 디렉토리는 쿼리를 직접 날려서 만들었다.
     *   - 루트 디렉토리는 건들지 않았다.
     *   - resetBaseDB 해 줄 필요 없다.
     */
    const connection = await db.getConnection()
    try {
      const {dirOId} = this
      const query = `DELETE FROM directories WHERE dirOId = ?`
      const param = [dirOId]

      await connection.execute(query, param)

      if (this.fileOId) {
        const query = `DELETE FROM files WHERE fileOId = ?`
        const param = [this.fileOId]

        await connection.execute(query, param)
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
      const {dirOId} = this

      const data: HTTP.AddFileType = {dirOId, fileName: ''}

      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addFile_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _2_emptyName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const data: HTTP.AddFileType = {dirOId, fileName: '  '}

      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addFile_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _3_tooLongName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const data: HTTP.AddFileType = {dirOId, fileName: 'a'.repeat(FILE_NAME_MAX_LENGTH + 1)}

      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addFile_InvalidFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _4_duplicateName(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const fileName = this.constructor.name

      const data: HTTP.AddFileType = {dirOId, fileName}

      await this.portService.addFile(jwtPayload, data)
      await this.portService.addFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_createFile_DuplicateFileName') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _5_nullDirOId(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const fileName = this.constructor.name

      const data: HTTP.AddFileType = {dirOId: null, fileName}

      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows

      const fileOId = fileOIdsArr.filter(_fileOId => fileRows[_fileOId].fileName === fileName)[0]

      this.fileOId = fileOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_addFile_InvalidDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _6_noParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const dirOId = '12345678'.repeat(3)

      const fileName = this.constructor.name

      const data: HTTP.AddFileType = {dirOId, fileName}

      const {extraFileRows} = await this.portService.addFile(jwtPayload, data)
      const {fileOIdsArr, fileRows} = extraFileRows

      const fileOId = fileOIdsArr.filter(_fileOId => fileRows[_fileOId].fileName === fileName)[0]

      this.fileOId = fileOId
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'FILEDB_createFile_InvalidDirOId') {
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
