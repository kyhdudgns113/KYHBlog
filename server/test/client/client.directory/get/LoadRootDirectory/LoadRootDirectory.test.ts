/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@modules/database'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 3

/**
 * ClientDirectoryPort 의 loadRootDirectory 함수를 테스트한다.
 *
 * 다음 시나리오대로 테스트한다.
 * 1. 기존 루트폴더 잘 읽어오나 테스트(테스트 DB 사용)
 * 2. 루트폴더 없는 상태에서 생성 테스트
 */
export class LoadRootDirectoryFunction extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private newRootDirOId: string = null
  private rootDirOId: string = null

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    /**
     * 테스트 준비
     * - 기존 루트폴더의 OID 만 저장한다
     */
    try {
      const {directory} = this.testDB.getRootDir()
      const {dirOId} = directory

      this.rootDirOId = dirOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_TestLoading.bind(this), db, logLevel)
      await this.memberOK(this._2_TestCreating.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()
    try {
      // 1. 새로 생성된 루트 디렉토리를 지운다.
      if (this.newRootDirOId) {
        const query = `DELETE FROM directories WHERE dirOId = ?`
        const param = [this.newRootDirOId]

        await connection.execute(query, param)
      }

      // 2. 기존 루트 디렉토리의 이름을 원래대로 돌려놓는다.
      const {dirName} = this.testDB.getRootDir().directory
      const query2 = `UPDATE directories SET dirName = ? WHERE dirOId = ?`
      const param2 = [dirName, this.rootDirOId]

      await connection.execute(query2, param2)
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

  private async _1_TestLoading(db: mysql.Pool, logLevel: number) {
    /**
     * 기존 루트폴더 잘 읽어오나 테스트
     *
     * 다음을 점검한다.
     * 1. rootDirOId 가 잘 읽어왔는지
     * 2. extraDirs 가 잘 읽어왔는지
     * 3. extraFileRows 가 잘 읽어왔는지
     */
    try {
      const {rootDirOId, extraDirs, extraFileRows} = await this.portService.loadRootDirectory()
      const {directory: prevRootDir} = this.testDB.getRootDir()

      // 1. rootDirOId 가 잘 읽어왔는지
      if (rootDirOId !== this.rootDirOId) {
        throw `1.rootDirOId 가 ${this.rootDirOId} 가 아닌 ${rootDirOId} 로 읽어왔다.`
      }

      /**
       * 2. extraDirs 가 잘 읽어왔는지 (dirOId, dirName, parentDirOId, subDirOIdsArr, fileOIdsArr 테스트)
       *   2-1. 루트 디렉토리가 잘 들어왔는지
       *   2-2. 0번째 자식 디렉토리가 잘 들어왔는지
       *   2-3. 1번째 자식 디렉토리가 잘 들어왔는지
       */

      // 2-1-1. 0번째 인덱스에 rootDir 의 OId 가 들어왔는지
      if (extraDirs.dirOIdsArr[0] !== this.rootDirOId) {
        throw `2-1-1. 0번째 인덱스에 rootDirOId 가 아닌 ${extraDirs[0].dirOId} 가 들어왔다.`
      }
      // 2-1-2. rootDir 가 들어왔는지
      if (!extraDirs.directories[rootDirOId]) {
        throw `2-1-2. rootDir 가 안 들어왔어요`
      }
      const dir_root = extraDirs.directories[rootDirOId]
      // 2-1-3. rootDir 의 OID 체크
      if (dir_root.dirOId !== prevRootDir.dirOId) {
        throw `2-1-3. rootDir 의 OId 가 아닌 ${dir_root.dirOId} 가 들어왔어요`
      }
      // 2-1-4. rootDir 의 이름 체크
      if (dir_root.dirName !== prevRootDir.dirName) {
        throw `2-1-4. rootDir 의 이름이 아닌 ${dir_root.dirName} 가 들어왔어요`
      }
      // 2-1-5. rootDir 의 parentDirOId 체크
      if (dir_root.parentDirOId !== prevRootDir.parentDirOId) {
        throw `2-1-5. rootDir 의 parentDirOId 가 ${prevRootDir.parentDirOId} 가 아닌 ${dir_root.parentDirOId} 가 들어왔어요`
      }
      // 2-1-6. rootDir 의 subDirOIdsArr 체크
      dir_root.subDirOIdsArr.forEach((subDirOId, index) => {
        if (subDirOId !== prevRootDir.subDirOIdsArr[index]) {
          throw `2-1-6. rootDir 의 ${index} 번째 자식 디렉토리의 OId 가 ${prevRootDir.subDirOIdsArr[index]} 가 아닌 ${subDirOId} 가 들어왔어요`
        }
      })
      // 2-1-7. rootDir 의 fileOIdsArr 체크
      dir_root.fileOIdsArr.forEach((fileOId, index) => {
        if (fileOId !== prevRootDir.fileOIdsArr[index]) {
          throw `2-1-7. rootDir 의 fileOIdsArr 가 ${prevRootDir.fileOIdsArr[index]} 가 아닌 ${fileOId} 가 들어왔어요`
        }
      })

      // 2-2-1. 1번째 인덱스에 0번째 자식 디렉토리의 OId 가 들어왔는지
      const dirOId_0 = prevRootDir.subDirOIdsArr[0]
      const {directory: prevDir_0} = this.testDB.getDirectory(dirOId_0)
      if (extraDirs.dirOIdsArr[1] !== dirOId_0) {
        throw `2-2-1. 1번째 인덱스에 0번째 자식 디렉토리의 OId 가 아닌 ${extraDirs.dirOIdsArr[1]} 가 들어왔어요`
      }
      // 2-2-2. 0번째 자식 디렉토리가 들어왔는지
      if (!extraDirs.directories[dirOId_0]) {
        throw `2-2-2. 0번째 자식 디렉토리가 안 들어왔어요`
      }
      const dir_0 = extraDirs.directories[dirOId_0]
      // 2-2-3. 0번째 자식 디렉토리의 OId 체크
      if (dir_0.dirOId !== dirOId_0) {
        throw `2-2-3. 0번째 자식 디렉토리의 OId 가 아닌 ${dir_0.dirOId} 가 들어왔어요`
      }
      // 2-2-4. 0번째 자식 디렉토리의 이름 체크
      if (dir_0.dirName !== prevDir_0.dirName) {
        throw `2-2-4. 0번째 자식 디렉토리의 이름이 아닌 ${dir_0.dirName} 가 들어왔어요`
      }
      // 2-2-5. 0번째 자식 디렉토리의 parentDirOId 체크
      if (dir_0.parentDirOId !== prevRootDir.dirOId) {
        throw `2-2-5. 0번째 자식 디렉토리의 parentDirOId 가 ${prevRootDir.dirOId} 가 아닌 ${dir_0.parentDirOId} 가 들어왔어요`
      }
      // 2-2-6. 0번째 자식 디렉토리의 subDirOIdsArr 체크
      dir_0.subDirOIdsArr.forEach((subDirOId, index) => {
        if (subDirOId !== prevDir_0.subDirOIdsArr[index]) {
          throw `2-2-6. 0번째 자식 디렉토리의 ${index} 번째 자식 디렉토리의 OId 가 ${prevDir_0.subDirOIdsArr[index]} 가 아닌 ${subDirOId} 가 들어왔어요`
        }
      })
      // 2-2-7. 0번째 자식 디렉토리의 fileOIdsArr 체크
      dir_0.fileOIdsArr.forEach((fileOId, index) => {
        if (fileOId !== prevDir_0.fileOIdsArr[index]) {
          throw `2-2-7. 0번째 자식 디렉토리의 ${index} 번째 파일의 OId 가 ${prevDir_0.fileOIdsArr[index]} 가 아닌 ${fileOId} 가 들어왔어요`
        }
      })

      // 2-3-1. 2번째 인덱스에 1번째 자식 디렉토리의 OId 가 들어왔는지
      const dirOId_1 = prevRootDir.subDirOIdsArr[1]
      const {directory: prevDir_1} = this.testDB.getDirectory(dirOId_1)
      if (extraDirs.dirOIdsArr[2] !== dirOId_1) {
        throw `2-3-1. 2번째 인덱스에 1번째 자식 디렉토리의 OId 가 아닌 ${extraDirs.dirOIdsArr[2]} 가 들어왔어요`
      }
      // 2-3-2. 1번째 자식 디렉토리가 들어왔는지
      if (!extraDirs.directories[dirOId_1]) {
        throw `2-3-2. 1번째 자식 디렉토리가 안 들어왔어요`
      }
      const dir_1 = extraDirs.directories[dirOId_1]
      // 2-3-3. 1번째 자식 디렉토리의 OId 체크
      if (dir_1.dirOId !== dirOId_1) {
        throw `2-3-3. 1번째 자식 디렉토리의 OId 가 아닌 ${dir_1.dirOId} 가 들어왔어요`
      }
      // 2-3-4. 1번째 자식 디렉토리의 이름 체크
      if (dir_1.dirName !== prevDir_1.dirName) {
        throw `2-3-4. 1번째 자식 디렉토리의 이름이 아닌 ${dir_1.dirName} 가 들어왔어요`
      }
      // 2-3-5. 1번째 자식 디렉토리의 parentDirOId 체크
      if (dir_1.parentDirOId !== prevRootDir.dirOId) {
        throw `2-3-5. 1번째 자식 디렉토리의 parentDirOId 가 ${prevRootDir.dirOId} 가 아닌 ${dir_1.parentDirOId} 가 들어왔어요`
      }
      // 2-3-6. 1번째 자식 디렉토리의 subDirOIdsArr 체크
      dir_1.subDirOIdsArr.forEach((subDirOId, index) => {
        if (subDirOId !== prevDir_1.subDirOIdsArr[index]) {
          throw `2-3-6. 1번째 자식 디렉토리의 ${index} 번째 자식 디렉토리의 OId 가 ${prevDir_1.subDirOIdsArr[index]} 가 아닌 ${subDirOId} 가 들어왔어요`
        }
      })
      // 2-3-7. 1번째 자식 디렉토리의 fileOIdsArr 체크
      dir_1.fileOIdsArr.forEach((fileOId, index) => {
        if (fileOId !== prevDir_1.fileOIdsArr[index]) {
          throw `2-3-7. 1번째 자식 디렉토리의 ${index} 번째 파일의 OId 가 ${prevDir_1.fileOIdsArr[index]} 가 아닌 ${fileOId} 가 들어왔어요`
        }
      })

      /**
       * 3. extraFileRows 가 잘 읽어왔는지 (fileOId 만 확인)
       *   3-1. 배열의 크기가 3인지
       *   3-2. 배열의 0번째 인덱스에 자식파일이 들어왔는지
       *   3-3. fileRows 에 자식파일의 fileRow 가 들어있는지
       */

      const prevFileOId_0 = prevRootDir.fileOIdsArr[0]

      // 3-1-1. 배열의 크기가 1인지
      if (extraFileRows.fileOIdsArr.length !== 3) {
        throw `3-1-1. 배열의 크기가 3이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // 3-1-2. 배열의 0번째 인덱스에 자식파일이 들어왔는지
      if (extraFileRows.fileOIdsArr[0] !== prevFileOId_0) {
        throw `3-1-2. 배열의 0번째 인덱스에 자식파일이 아닌 ${extraFileRows.fileOIdsArr[0]} 가 들어왔어요`
      }
      // 3-1-3. fileRows 에 자식파일의 fileRow 가 들어있는지
      if (extraFileRows.fileRows[prevFileOId_0].fileOId !== prevFileOId_0) {
        throw `3-1-3. fileRows 에 자식파일의 fileRow 가 들어있지 않아요`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async _2_TestCreating(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()
    try {
      // 1. 기존 루트 디렉토리의 이름을 변경한다.
      const {directory: prevRootDir} = this.testDB.getRootDir()
      const query = `UPDATE directories SET dirName = ? WHERE dirOId = ?`
      const param = [this.constructor.name, prevRootDir.dirOId]

      await connection.execute(query, param)

      // 2. 루트 디렉토리를 생성한다.
      const {rootDirOId, extraDirs, extraFileRows} = await this.portService.loadRootDirectory()
      this.newRootDirOId = rootDirOId

      /**
       * 3. extraDirs 를 확인한다.
       *   3-1. 배열의 크기가 1인지
       *   3-2. 디렉토리 이름이 올바른지
       *   3-3. 디렉토리의 부모 이름이 올바른지
       */

      // 3-1. 배열의 크기가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-1. 배열의 크기가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 3-2 디렉토리 이름이 올바른지
      const newRootDir = extraDirs.directories[rootDirOId]
      if (newRootDir.dirName !== prevRootDir.dirName) {
        throw `3-2. 디렉토리 이름이 아닌 ${newRootDir.dirName} 가 들어왔어요  `
      }
      // 3-3. 디렉토리의 부모 이름이 올바른지
      if (newRootDir.parentDirOId !== prevRootDir.parentDirOId) {
        throw `3-3. 디렉토리의 부모 이름이 아닌 ${newRootDir.parentDirOId} 가 들어왔어요`
      }

      /**
       * 4. extraFileRows 를 확인한다.
       *   4-1. 배열의 크기가 0인지
       *   4-2. fileRows 에 아무것도 안 들어왔는지
       */

      // 4-1. 배열의 크기가 0인지
      if (extraFileRows.fileOIdsArr.length !== 0) {
        throw `4-1. 배열의 크기가 0이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // 4-2. fileRows 에 아무것도 안 들어왔는지
      const rowsLen = Object.keys(extraFileRows.fileRows).length
      if (rowsLen !== 0) {
        throw `4-2. fileRows 에 왜 ${rowsLen} 개가 들어왔어요`
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
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new LoadRootDirectoryFunction(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
