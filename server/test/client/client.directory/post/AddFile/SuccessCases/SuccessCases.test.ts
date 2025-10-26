/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as HTTP from '@httpDataType'
import * as mysql from 'mysql2/promise'

import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

/**
 * ClientDirectoryPort 의 addFile 함수 실행을 테스트한다.
 *   - 정상 작동을 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 상황
 *   - 임의의 폴더릃 하나 만들고 그 폴더 내에서 실행한다.
 *
 * 시나리오
 *   1. 빈 폴더에 addFile 을 한 번 실행한다.
 *   2. addFile 을 한 번 더 실행한다.
 */
export class SuccessCases extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''
  private fileOId_0: string = ''
  private fileName_0: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    /**
     * 빈 폴더를 만든다.
     */
    try {
      const parentDirOid = null
      const dirIdx = 0
      const dirName = this.constructor.name
      const dirOId = '00000000' + '00000000' + '12345678'

      const query = `INSERT INTO directories (dirOId, parentDirOid, dirIdx, dirName) VALUES (?, ?, ?, ?)`
      const param = [dirOId, parentDirOid, dirIdx, dirName]

      await db.execute(query, param)

      this.dirOId = dirOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_first_addFile.bind(this), db, logLevel)
      await this.memberOK(this._2_second_addFile.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()

    try {
      const query = `DELETE FROM directories WHERE dirOId = ?`
      const param = [this.dirOId]

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

  private async _1_first_addFile(db: mysql.Pool, logLevel: number) {
    /**
     * 빈 폴더에 addFile 을 한 번 실행한다.
     *
     * 다음을 테스트한다.
     *   1. 폴더 배열의 길이가 1인가
     *   2. 부모 폴더: OId 체크
     *   3. 부모 폴더: 폴더 배열 길이 0 인가?
     *   4. 부모 폴더: 파일 배열 길이 1 인가?
     *   5. 파일 배열의 길이가 1인가
     *   6. 파일 이름이 잘 들어가있는가
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const fileName = this.constructor.name + '_0'

      const data: HTTP.AddFileType = {dirOId, fileName}

      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)

      // 1. 폴더 배열의 길이가 1인가
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. 폴더 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length}`
      }

      // 2. 부모 폴더: OId 체크
      const _dirOId = extraDirs.dirOIdsArr[0]
      const _parentDirOid = extraDirs.directories[_dirOId].dirOId
      if (_parentDirOid !== dirOId) {
        throw `2. 부모 폴더: OId 가 ${dirOId} 이 아닌 ${_parentDirOid}`
      }

      // 3. 부모 폴더: 폴더 배열 길이 0 인가?
      const directory = extraDirs.directories[_dirOId]
      if (directory.subDirOIdsArr.length !== 0) {
        throw `3. 부모 폴더: 폴더 배열의 길이가 0이 아닌 ${directory.subDirOIdsArr.length}`
      }

      // 4. 부모 폴더: 파일 배열 길이 1 인가?
      if (directory.fileOIdsArr.length !== 1) {
        throw `4. 부모 폴더: 파일 배열의 길이가 1이 아닌 ${directory.fileOIdsArr.length}`
      }

      // 5. 파일 배열의 길이가 1인가
      const {fileOIdsArr, fileRows} = extraFileRows
      if (fileOIdsArr.length !== 1) {
        throw `5. 파일 배열의 길이가 1이 아닌 ${fileOIdsArr.length}`
      }

      // 6. 파일 이름이 잘 들어가있는가
      const fileOId = fileOIdsArr[0]
      const {fileName: _fileName} = fileRows[fileOId]

      if (_fileName !== fileName) {
        throw `6. 파일 이름이 ${fileName} 이 아닌 ${_fileName}`
      }

      this.fileOId_0 = fileOId
      this.fileName_0 = fileName
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_second_addFile(db: mysql.Pool, logLevel: number) {
    /**
     * 이미 파일이 있는 폴더에 addFile 을 한 번 더 실행한다.
     *
     * 다음을 테스트한다.
     *   1. 폴더 배열의 길이가 1인가
     *   2. 부모 폴더: OId 체크
     *   3. 부모 폴더: 폴더 배열 길이 0 인가?
     *   4. 부모 폴더: 파일 배열 길이 2 인가?
     *   5. 파일 배열의 길이가 2인가
     *   6. 이전에 넣은 파일이 그대로 있는가
     *   7. 새로 넣은 파일이 있는가
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this

      const fileName = this.constructor.name + '_1'

      const data: HTTP.AddFileType = {dirOId, fileName}

      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)

      // 1. 폴더 배열의 길이가 1인가
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. 폴더 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length}`
      }

      // 2. 부모 폴더: OId 체크
      const _dirOId = extraDirs.dirOIdsArr[0]
      const _parentDirOid = extraDirs.directories[_dirOId].dirOId
      if (_parentDirOid !== dirOId) {
        throw `2. 부모 폴더: OId 가 ${dirOId} 이 아닌 ${_parentDirOid}`
      }

      // 3. 부모 폴더: 폴더 배열 길이 0 인가?
      const directory = extraDirs.directories[_dirOId]
      if (directory.subDirOIdsArr.length !== 0) {
        throw `3. 부모 폴더: 폴더 배열의 길이가 0이 아닌 ${directory.subDirOIdsArr.length}`
      }

      // 4. 부모 폴더: 파일 배열 길이 2 인가?
      if (directory.fileOIdsArr.length !== 2) {
        throw `4. 부모 폴더: 파일 배열의 길이가 2이 아닌 ${directory.fileOIdsArr.length}`
      }

      // 5. 파일 배열의 길이가 2인가
      const {fileOIdsArr, fileRows} = extraFileRows
      if (fileOIdsArr.length !== 2) {
        throw `5. 파일 배열의 길이가 2이 아닌 ${fileOIdsArr.length}`
      }

      // 6. 이전에 넣은 파일이 그대로 있는가
      const fileOId_0 = fileOIdsArr[0]
      const {fileName: _fileName_0} = fileRows[fileOId_0]

      if (fileOId_0 !== this.fileOId_0) {
        throw `6. 0번째 파일 OId 가 ${this.fileOId_0} 이 아닌 ${fileOId_0}`
      }

      if (_fileName_0 !== this.fileName_0) {
        throw `6. 0번째 파일 이름이 ${this.fileName_0} 이 아닌 ${_fileName_0}`
      }

      // 7. 새로 넣은 파일이 있는가
      const fileOId_1 = fileOIdsArr[1]
      const {fileName: _fileName_1} = fileRows[fileOId_1]

      if (_fileName_1 !== fileName) {
        throw `7. 1번째 파일 이름이 ${fileName} 이 아닌 ${_fileName_1}`
      }
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
  const testModule = new SuccessCases(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
