/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {ClientDirPortServiceTest} from '@module'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * SuccessCases
 *   - client.directory 의 LoadDirectory 함수의 서브 테스트 모듈
 *   - 정상적인 입력값을 넣었을 때 정상적으로 작동하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 서브 테스트
 *   1. 루트 디렉토리의 OId 를 시도할때
 *   2. 루트 디렉토리의 0번째 자식 디렉토리를 시도할때때
 */
export class SuccessCases extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_TestRootDir.bind(this), db, logLevel)
      await this.memberOK(this._2_TestRootDirChildDir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    // DO NOTHING:
  }

  /**
   * _1_TestRootDir
   *   - 루트 디렉토리를 읽어오려 시도할때
   *
   * 테스트 내용
   *   1. extraDirs
   *       1. 배열의 크기가 1인가
   *       2. 폴더의 정보 확인: dirName
   *       3. 폴더의 정보 확인: dirOId
   *       4. 폴더의 정보 확인: parentDirOId
   *       5. 폴더의 정보 확인: fileOIdsArr
   *       6. 폴더의 정보 확인: subDirOIdsArr
   *   2. extraFileRows
   *       1. 배열의 크기가 1인가
   *       2. 파일의 정보 확인: fileOId
   */
  private async _1_TestRootDir(db: mysql.Pool, logLevel: number) {
    try {
      const {directory} = this.testDB.getRootDir()
      const {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr} = directory

      const {extraDirs, extraFileRows} = await this.portService.loadDirectory(dirOId)

      /**
       * 1. extraDirs 테스트
       */

      // 1-1. 배열의 크기가 1인가
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 크기가 1이 아닌 ${extraDirs.dirOIdsArr.length}.`
      }

      const _dirOId = extraDirs.dirOIdsArr[0]
      const _directory = extraDirs.directories[_dirOId]

      // 1-2. 폴더의 정보 확인: dirName
      if (_directory.dirName !== dirName) {
        throw `1-2. 폴더의 이름이 ${dirName} 이 아닌 ${_directory.dirName} 이다.`
      }

      // 1-3. 폴더의 정보 확인: dirOId
      if (_dirOId !== dirOId) {
        throw `1-3. 폴더의 OId 가 ${dirOId} 이 아닌 ${_dirOId} 이다.`
      }

      // 1-4. 폴더의 정보 확인: parentDirOId
      if (_directory.parentDirOId !== parentDirOId) {
        throw `1-4. 폴더의 부모 OId 가 ${parentDirOId} 이 아닌 ${_directory.parentDirOId} 이다.`
      }

      // 1-5. 폴더의 정보 확인: fileOIdsArr
      if (_directory.fileOIdsArr.length !== fileOIdsArr.length) {
        throw `1-5. 폴더의 파일 OId 배열의 크기가 ${fileOIdsArr.length} 이 아닌 ${_directory.fileOIdsArr.length} 이다.`
      }

      // 1-6. 폴더의 정보 확인: subDirOIdsArr
      if (_directory.subDirOIdsArr.length !== subDirOIdsArr.length) {
        throw `1-6. 폴더의 자식 폴더 OId 배열의 크기가 ${subDirOIdsArr.length} 이 아닌 ${_directory.subDirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows 테스트
       */

      // 2-1. 배열의 크기가 1인가
      if (extraFileRows.fileOIdsArr.length !== fileOIdsArr.length) {
        throw `2-2. 파일의 OId 배열의 크기가 ${fileOIdsArr.length} 이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const _fileOId = extraFileRows.fileOIdsArr[0]
      const _fileRow = extraFileRows.fileRows[_fileOId]

      // 2-2. 파일의 정보 확인: fileOId
      if (_fileOId !== fileOIdsArr[0]) {
        throw `2-2. 파일의 OId 가 ${fileOIdsArr[0]} 이 아닌 ${_fileOId} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  /**
   * _2_TestRootDirChildDir
   *   - 루트 디렉토리의 0번째 자식 디렉토리를 읽어오려 시도할때
   *
   * 테스트 내용
   *   1. extraDirs
   *       1. 배열의 크기가 1인가
   *       2. 폴더의 정보 확인: dirName
   *       3. 폴더의 정보 확인: dirOId
   *       4. 폴더의 정보 확인: parentDirOId
   *   2. extraFileRows
   *       1. 배열의 크기가 1인가
   *       2. 파일의 정보 확인: fileOId
   */
  private async _2_TestRootDirChildDir(db: mysql.Pool, logLevel: number) {
    try {
      const {directory: rootDir} = this.testDB.getRootDir()
      const {dirOId: rootDirOId, subDirOIdsArr: rootDirArr} = rootDir

      const dirOId = rootDirArr[0]
      const {directory} = this.testDB.getDirectory(dirOId)
      const {dirName, fileOIdsArr, subDirOIdsArr} = directory

      const {extraDirs, extraFileRows} = await this.portService.loadDirectory(dirOId)

      // 1-1. 배열의 크기가 1인가
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 크기가 1이 아닌 ${extraDirs.dirOIdsArr.length}.`
      }

      const _dirOId = extraDirs.dirOIdsArr[0]
      const _directory = extraDirs.directories[_dirOId]

      // 1-2. 폴더의 정보 확인: dirName
      if (_directory.dirName !== dirName) {
        throw `1-2. 폴더의 이름이 ${dirName} 이 아닌 ${_directory.dirName} 이다.`
      }

      // 1-3. 폴더의 정보 확인: dirOId
      if (_dirOId !== dirOId) {
        throw `1-3. 폴더의 OId 가 ${dirOId} 이 아닌 ${_dirOId} 이다.`
      }

      // 1-4. 폴더의 정보 확인: parentDirOId
      if (_directory.parentDirOId !== rootDirOId) {
        throw `1-4. 폴더의 부모 OId 가 ${rootDirOId} 이 아닌 ${_directory.parentDirOId} 이다.`
      }

      // 1-5. 폴더의 정보 확인: fileOIdsArr
      if (_directory.fileOIdsArr.length !== fileOIdsArr.length) {
        throw `1-5. 폴더의 파일 OId 배열의 크기가 ${fileOIdsArr.length} 이 아닌 ${_directory.fileOIdsArr.length} 이다.`
      }

      // 1-6. 폴더의 정보 확인: subDirOIdsArr
      if (_directory.subDirOIdsArr.length !== subDirOIdsArr.length) {
        throw `1-6. 폴더의 자식 폴더 OId 배열의 크기가 ${subDirOIdsArr.length} 이 아닌 ${_directory.subDirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows 테스트
       */

      // 2-1. 배열의 크기가 1인가
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 파일의 OId 배열의 크기가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      const _fileOId = extraFileRows.fileOIdsArr[0]

      // 2-2. 파일의 정보 확인: fileOId
      if (_fileOId !== fileOIdsArr[0]) {
        throw `2-2. 파일의 OId 가 ${fileOIdsArr[0]} 이 아닌 ${_fileOId} 이다.`
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
