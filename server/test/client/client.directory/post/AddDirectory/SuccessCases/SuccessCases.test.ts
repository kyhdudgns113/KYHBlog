/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {AUTH_ADMIN} from '@secret'
import {ClientDirPortServiceTest} from '@module'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import * as ST from '@shareType'
import {RESET_FLAG_DIR, RESET_FLAG_FILE} from '@testValue'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * ClientDirectoryPort 의 addDirectory 함수 실행을 테스트한다.
 *   - 성공 케이스들을 테스트한다.
 *
 * 상황
 *   - 루트 디렉토리에 폴더를 하나 만든다.
 *
 * 서브 테스트
 *   1. 부모 폴더가 없는 경우
 *   2. 부모 폴더가 있는 경우
 *   3. 부모 폴더가 루트 폴더인 경우
 */
export class SuccessCases extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''
  private extraDirs: ST.ExtraDirObjectType
  private extraFileRows: ST.ExtraFileRowObjectType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    /**
     * 점검사항
     *   1. extraDirs
     *     1-1. dirOIdsArr 배열 길이가 2인가
     *     1-2. dirOIdsArr 배열 첫번째 요소가 부모 폴더의 dirOId 인가
     *     1-3. dirOIdsArr 배열 두번째 요소가 새로 만든 폴더의 dirOId 인가
     *     1-4. directories 객체 길이가 2인가
     *     1-5. directories 객체 첫번째 요소가 부모 폴더의 dirOId 인가
     *     1-6. directories 객체 첫번째 요소의 subDirOIdsArr 배열 길이가 3인가
     *     1-7. directories 객체 두번째 요소가 새로 만든 폴더의 dirOId 인가
     *   2. extraFileRows
     *     2-1. extraFileRows 배열 길이가 1인가
     *     2-2. extraFileRows 배열 첫번째 요소의 dirOId 가 부모 폴더의 dirOId 인가
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const dirName = this.constructor.name
      const parentDirOId = this.testDB.getRootDir().directory.dirOId

      const data: HTTP.AddDirectoryType = {dirName, parentDirOId}

      const {extraDirs, extraFileRows} = await this.portService.addDirectory(jwtPayload, data)
      const {dirOIdsArr, directories} = extraDirs

      this.dirOId = dirOIdsArr.filter(_dirOId => directories[_dirOId].dirName === dirName)[0]
      this.extraDirs = extraDirs
      this.extraFileRows = extraFileRows

      await this.memberOK(this._1_checkExtraDirs.bind(this), db, logLevel)
      await this.memberOK(this._2_checkExtraFileRows.bind(this), db, logLevel)
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

  /**
   * extraDirs 를 점검한다.
   *   1. dirOIdsArr 배열 길이가 2인가
   *   2. dirOIdsArr 배열 첫번째 요소가 부모 폴더의 dirOId 인가
   *   3. dirOIdsArr 배열 두번째 요소가 새로 만든 폴더의 dirOId 인가
   *   4. directories 객체 길이가 2인가
   *   5. directories 객체 첫번째 요소가 부모 폴더의 dirOId 인가
   *   6. directories 객체 첫번째 요소의 subDirOIdsArr 배열 길이가 3인가
   *   7. directories 객체 두번째 요소가 새로 만든 폴더의 dirOId 인가
   */
  private async _1_checkExtraDirs(db: mysql.Pool, logLevel: number) {
    try {
      const parentDirOId = this.testDB.getRootDir().directory.dirOId
      const {dirOId, extraDirs} = this
      const {dirOIdsArr, directories} = extraDirs

      // 1. dirOIdsArr 배열 길이가 2인가
      if (dirOIdsArr.length !== 2) {
        throw `1. dirOIdsArr 배열 길이가 2가 아닌 ${dirOIdsArr.length}`
      }

      // 2. dirOIdsArr 배열 첫번째 요소가 부모 폴더의 dirOId 인가
      if (dirOIdsArr[0] !== parentDirOId) {
        throw `2. dirOIdsArr 배열 첫번째 요소가 부모 폴더의 dirOId 가 아닌 ${dirOIdsArr[0]}`
      }

      // 3. dirOIdsArr 배열 두번째 요소가 새로 만든 폴더의 dirOId 인가
      if (dirOIdsArr[1] !== dirOId) {
        throw `3. dirOIdsArr 배열 두번째 요소가 새로 만든 폴더의 dirOId 가 아닌 ${dirOIdsArr[1]}`
      }

      // 4. directories 객체 길이가 2인가
      if (Object.keys(directories).length !== 2) {
        throw `4. directories 객체 길이가 2가 아닌 ${Object.keys(directories).length}`
      }

      // 5. directories 객체 첫번째 요소가 부모 폴더의 dirOId 인가
      if (directories[parentDirOId].dirOId !== parentDirOId) {
        throw `5. 부모의 dirOId 가 아닌 ${Object.keys(directories)[0]}`
      }

      // 6. directories 객체 첫번째 요소의 subDirOIdsArr 배열 길이가 3인가
      if (directories[parentDirOId].subDirOIdsArr.length !== 3) {
        throw `6. 부모의 subDirOIdsArr 배열 길이가 3가 아닌 ${directories[parentDirOId].subDirOIdsArr.length}`
      }

      // 7. directories 객체 두번째 요소가 새로 만든 폴더의 dirOId 인가
      if (directories[dirOId].dirOId !== dirOId) {
        throw `7. 새로 만든 폴더의 dirOId 가 아닌 ${directories[dirOId].dirOId}`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * extraFileRows 를 점검한다.
   *   1. extraFileRows 배열 길이가 1인가
   *   2. extraFileRows 배열 첫번째 요소의 dirOId 가 부모 폴더의 dirOId 인가
   */
  private async _2_checkExtraFileRows(db: mysql.Pool, logLevel: number) {
    try {
      const {extraFileRows} = this
      const {fileOIdsArr, fileRows} = extraFileRows

      // 1. extraFileRows 배열 길이가 1인가
      if (fileOIdsArr.length !== 1) {
        throw `1. extraFileRows 배열 길이가 1가 아닌 ${fileOIdsArr.length}`
      }

      const fileOId = fileOIdsArr[0]

      // 2. extraFileRows 배열 첫번째 요소의 dirOId 가 부모 폴더의 dirOId 인가
      if (fileRows[fileOId].dirOId !== this.testDB.getRootDir().directory.dirOId) {
        throw `2. extraFileRows 배열 첫번째 요소의 dirOId 가 부모 폴더의 dirOId 가 아닌 ${fileRows[0].dirOId}`
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
