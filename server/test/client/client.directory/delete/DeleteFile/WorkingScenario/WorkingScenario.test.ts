/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'
import {RowDataPacket} from 'mysql2/promise'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - ClientDirectoryPort 의 deleteFile 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 루트 폴더에 테스트 폴더를 하나 light 버전으로 생성한다.
 *   - 테스트 폴더에 자식파일 4개를 full 버전으로 생성한다.
 *   - 테스트 폴더에 자식폴더를 3개 full 버전으로 생성한다.
 *   - 각 자식폴더에 파식파일을 3개씩 full 버전으로 생성한다.
 *
 * 시나리오
 *   1. 테스트 폴더의 맨 앞 파일을 삭제한다.
 *   2. 0번째 자식 폴더의 맨 앞 파일을 삭제한다.
 *   3. 0번째 폴더의 맨 뒤 파일을 삭제한다.
 *     - 중복인 이름의 파일을 삭제한다.
 *   4. 테스트 폴더의 맨 뒤 파일을 삭제한다.
 *   5. 현재 테스트 폴더의 맨 앞 파일을 중복으로 삭제한다.
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private fileOIds = {}
  private dirOIds = {}

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.dirOIds[`root`] = ''
    for (let i = 0; i < 4; i++) {
      this.fileOIds[`file${i}`] = ''
    }
    for (let i = 0; i < 3; i++) {
      this.dirOIds[`dir${i}`] = ''
      for (let j = 0; j < 3; j++) {
        this.fileOIds[`file${i}_${j}`] = ''
      }
    }
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId: rootDirOId} = this.testDB.getRootDir().directory
      const dirName = 'TEST_DIR'
      const {directory} = await this.testDB.createDirectoryLight(rootDirOId, dirName)
      this.dirOIds[`root`] = directory.dirOId

      // 테스트 폴더에 자식파일 4개를 full 버전으로 생성한다.
      for (let i = 0; i < 4; i++) {
        const {file} = await this.testDB.createFileFull(this.dirOIds[`root`], `file${i}`)
        this.fileOIds[`file${i}`] = file.fileOId
      }

      // 테스트 폴더에 자식폴더를 3개 full 버전으로 생성한다.
      for (let i = 0; i < 3; i++) {
        const {directory: dir} = await this.testDB.createDirectoryFull(this.dirOIds[`root`], `dir${i}`)
        this.dirOIds[`dir${i}`] = dir.dirOId

        // 각 자식폴더에 자식파일을 3개씩 full 버전으로 생성한다.
        for (let j = 0; j < 3; j++) {
          const {file} = await this.testDB.createFileFull(this.dirOIds[`dir${i}`], `file${i}_${j}`)
          this.fileOIds[`file${i}_${j}`] = file.fileOId
        }

        // 테스트 폴더의 파일중 하나랑 중복인 이름의 파일을 하나 만든다.
        const {file} = await this.testDB.createFileFull(this.dirOIds[`dir${i}`], `file3`)
        this.fileOIds[`file${i}_${3}`] = file.fileOId
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_DeleteFirstFile.bind(this), db, logLevel)
      await this.memberOK(this._2_DeleteFirstFileInFirstDirectory.bind(this), db, logLevel)
      await this.memberOK(this._3_DeleteDuplicateNameFile.bind(this), db, logLevel)
      await this.memberOK(this._4_DeleteLastFile.bind(this), db, logLevel)
      await this.memberOK(this._5_DeleteFileAgain.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.dirOIds[`root`]) {
        await this.testDB.deleteDirectoryLight(this.dirOIds[`root`])
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_DeleteFirstFile(db: mysql.Pool, logLevel: number) {
    /**
     * 테스트 폴더의 맨 앞 파일을 삭제한다.
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열 길이가 1인가?
     *     1-2. 부모폴더 잘 들어왔나?
     *     1-3. 부모폴더의 자식폴더 배열 길이 3인가?
     *     1-4. 부모폴더의 자식파일 배열 길이 3인가?
     *   2. extraFileRows
     *     2-1. 배열 길이가 3인가?
     *     2-2. 배열에 1~3 번째 요소가 들어가있는가?
     *   3. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, this.fileOIds[`file0`])

      /**
       * 1. extraDirs
       *   1-1. 배열 길이가 1인가?
       *   1-2. 부모폴더 잘 들어왔나?
       *   1-3. 부모폴더의 자식폴더 배열 길이 3인가?
       *   1-4. 부모폴더의 자식파일 배열 길이 3인가?
       */

      // 1-1. 배열 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. extraDirs 배열 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. 부모폴더 잘 들어왔나?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `1-2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }
      if (!_parentDir) {
        throw `1-2. 부모폴더가 들어오지 않았다.`
      }

      // 1-3. 부모폴더의 자식폴더 배열 길이 3인가?
      if (_parentDir.subDirOIdsArr.length !== 3) {
        throw `1-3. 부모폴더의 자식폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 1-4. 부모폴더의 자식파일 배열 길이 3인가?
      if (_parentDir.fileOIdsArr.length !== 3) {
        throw `1-4. 부모폴더의 자식파일 배열 길이가 3이 아닌 ${_parentDir.fileOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열 길이가 3인가?
       *   2-2. 배열에 1~3 번째 요소가 들어가있는가?
       */

      // 2-1. 배열 길이가 3인가?
      if (extraFileRows.fileOIdsArr.length !== 3) {
        throw `2-1. extraFileRows 배열 길이가 3이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. 배열에 1~3 번째 요소가 들어가있는가?
      const fileIdxs = [1, 2, 3]
      for (let i = 0; i < extraFileRows.fileOIdsArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== this.fileOIds[`file${fileIdxs[i]}`]) {
          throw `2-2. 배열의 ${i}번째 원소가 ${this.fileOIds[`file${fileIdxs[i]}`]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 3. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget = [this.fileOIds[`file0`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `3. 실제로 삭제가 되지 않았다.`
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_DeleteFirstFileInFirstDirectory(db: mysql.Pool, logLevel: number) {
    /**
     * 0번째 자식 폴더의 맨 앞 파일을 삭제한다.
     *
     * 점검사항
     *   1. extraDirs
     *   2. extraFileRows
     *   3. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   4. 삭제된 파일의 부모폴더의 자식파일 배열에서 삭제된 파일이 삭제되었는가?
     *     - 쿼리로 직접 읽어본다
     *   5. 테스트 폴더의 자식 파일이 멀쩡한지 확인한다.
     *     - 쿼리로 직접 확인한다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, this.fileOIds[`file0_0`])

      /**
       * 1. extraDirs
       *   1-1. 배열 길이가 1인가?
       *   1-2. 부모폴더 잘 들어왔나?
       *   1-3. 부모폴더의 자식폴더 배열 길이 0인가?
       *   1-4. 부모폴더의 자식파일 배열 길이 3인가?
       */
      // 1-1. 배열 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. extraDirs 배열 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. 부모폴더 잘 들어왔나?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (_parentDirOId !== this.dirOIds[`dir0`]) {
        throw `1-2. 배열의 0번째 원소가 ${this.dirOIds[`dir0`]} 이 아닌 ${_parentDirOId} 이다.`
      }
      if (!_parentDir) {
        throw `1-2. 부모폴더가 들어오지 않았다.`
      }

      // 1-3. 부모폴더의 자식폴더 배열 길이 0인가?
      if (_parentDir.subDirOIdsArr.length !== 0) {
        throw `1-3. 부모폴더의 자식폴더 배열 길이가 0이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 1-4. 부모폴더의 자식파일 배열 길이 3인가?
      if (_parentDir.fileOIdsArr.length !== 3) {
        throw `1-4. 부모폴더의 자식파일 배열 길이가 3이 아닌 ${_parentDir.fileOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열 길이가 3인가?
       *   2-2. 배열에 1~3 번째 요소가 들어가있는가?
       */

      // 2-1. 배열 길이가 3인가?
      if (extraFileRows.fileOIdsArr.length !== 3) {
        throw `2-1. extraFileRows 배열 길이가 3이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. 배열에 1~3 번째 요소가 들어가있는가?
      const fileIdxs = [1, 2, 3]
      for (let i = 0; i < extraFileRows.fileOIdsArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== this.fileOIds[`file0_${fileIdxs[i]}`]) {
          throw `2-2. 배열의 ${i}번째 원소가 ${this.fileOIds[`file0_${fileIdxs[i]}`]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 3. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget = [this.fileOIds[`file0_0`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `3. 실제로 삭제가 되지 않았다.`
      }

      // 4. 삭제된 파일의 부모폴더의 자식파일 배열에서 삭제된 파일이 삭제되었는가?
      const queryTarget2 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget2 = [this.fileOIds[`file0_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `4. 삭제된 파일의 부모폴더의 자식파일 배열에서 삭제된 파일이 삭제되지 않았다.`
      }

      // 5. 테스트 폴더의 자식 파일이 멀쩡한지 확인한다.
      const queryTarget3 = `SELECT * FROM files WHERE dirOId = ?`
      const paramTarget3 = [this.dirOIds[`root`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 3) {
        throw `5. 테스트 폴더의 자식 파일이 멀쩡하지 않다. 길이가 3이 아닌 ${_resultArr3.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_DeleteDuplicateNameFile(db: mysql.Pool, logLevel: number) {
    /**
     * 0번째 폴더의 맨 뒤 파일을 삭제한다.
     * - 중복인 이름의 파일을 삭제한다.
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열 길이가 1인가?
     *     1-2. 부모폴더 잘 들어왔나?
     *     1-3. 부모폴더의 자식폴더 배열 길이 0인가?
     *     1-4. 부모폴더의 자식파일 배열 길이 3인가?
     *   2. extraFileRows
     *     2-1. 배열 길이가 3인가?
     *     2-2. 배열에 0~2 번째 요소가 들어가있는가?
     *   3. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   4. 삭제된 파일의 부모폴더의 자식파일 배열에서 삭제된 파일이 삭제되었는가?
     *     - 쿼리로 직접 읽어본다
     *   5. 나머지 폴더들에 있는 같은 이름의 파일이 남아있는지 확인
     *     - 쿼리로 직접 읽어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, this.fileOIds[`file0_3`])

      /**
       * 1. extraDirs
       *   1-1. 배열 길이가 1인가?
       *   1-2. 부모폴더 잘 들어왔나?
       *   1-3. 부모폴더의 자식폴더 배열 길이 0인가?
       *   1-4. 부모폴더의 자식파일 배열 길이 3인가?
       */

      // 1-1. 배열 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. extraDirs 배열 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. 부모폴더 잘 들어왔나?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (_parentDirOId !== this.dirOIds[`dir0`]) {
        throw `1-2. 배열의 0번째 원소가 ${this.dirOIds[`dir0`]} 이 아닌 ${_parentDirOId} 이다.`
      }
      if (!_parentDir) {
        throw `1-2. 부모폴더가 들어오지 않았다.`
      }

      // 1-3. 부모폴더의 자식폴더 배열 길이 0인가?
      if (_parentDir.subDirOIdsArr.length !== 0) {
        throw `1-3. 부모폴더의 자식폴더 배열 길이가 0이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 1-4. 부모폴더의 자식파일 배열 길이 2인가?
      if (_parentDir.fileOIdsArr.length !== 2) {
        throw `1-4. 부모폴더의 자식파일 배열 길이가 2가 아닌 ${_parentDir.fileOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열 길이가 2인가?
       *   2-2. 배열에 1~2 번째 요소가 들어가있는가?
       */

      // 2-1. 배열 길이가 2인가?
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. extraFileRows 배열 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. 배열에 1~2 번째 요소가 들어가있는가?
      const fileIdxs = [1, 2]
      for (let i = 0; i < extraFileRows.fileOIdsArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== this.fileOIds[`file0_${fileIdxs[i]}`]) {
          throw `2-2. 배열의 ${i}번째 원소가 ${this.fileOIds[`file0_${fileIdxs[i]}`]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 3. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget = [this.fileOIds[`file0_3`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `3. 실제로 삭제가 되지 않았다.`
      }

      // 4. 삭제된 파일의 부모폴더의 자식파일 배열에서 삭제된 파일이 삭제되었는가?
      const queryTarget2 = `SELECT * FROM files WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 2) {
        throw `4. 부모폴더의 자식파일 배열 길이가 2가 아닌 ${_resultArr2.length} 이다.`
      }

      // 5. 나머지 폴더들에 있는 같은 이름의 파일이 남아있는지 확인
      // 테스트 폴더에 있던 중복된 이름의 파일이 남아있는지 확인
      const queryTarget3 = `SELECT * FROM files WHERE fileName = ? AND dirOId = ?`
      const paramTarget3 = [`file3`, this.dirOIds[`root`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 1) {
        throw `5. 테스트 폴더에 있던 중복된 이름의 파일이 1개가 아니다. ${_resultArr3.length} 개이다.`
      }

      // dir1에 있던 중복된 이름의 파일이 남아있는지 확인
      const queryTarget4 = `SELECT * FROM files WHERE fileName = ? AND dirOId = ?`
      const paramTarget4 = [`file3`, this.dirOIds[`dir1`]]
      const [_result4] = await db.execute(queryTarget4, paramTarget4)
      const _resultArr4 = _result4 as RowDataPacket[]
      if (_resultArr4.length !== 1) {
        throw `5. dir1에 있던 중복된 이름의 파일이 1개가 아니다. ${_resultArr4.length} 개이다.`
      }

      // dir2에 있던 중복된 이름의 파일이 남아있는지 확인
      const queryTarget5 = `SELECT * FROM files WHERE fileName = ? AND dirOId = ?`
      const paramTarget5 = [`file3`, this.dirOIds[`dir2`]]
      const [_result5] = await db.execute(queryTarget5, paramTarget5)
      const _resultArr5 = _result5 as RowDataPacket[]
      if (_resultArr5.length !== 1) {
        throw `5. dir2에 있던 중복된 이름의 파일이 1개가 아니다. ${_resultArr5.length} 개이다.`
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_DeleteLastFile(db: mysql.Pool, logLevel: number) {
    /**
     * 테스트 폴더의 맨 뒤 파일을 삭제한다.
     *
     * 점검사항
     *   1. extraDirs
     *   2. extraFileRows
     *     2-1. 배열 길이가 1인가?
     *     2-2. 배열에 0번째 요소가 들어가있는가?
     *   3. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   4. 나머지 폴더들에 있는 같은 이름의 파일이 남아있는지 확인
     *     - 쿼리로 직접 읽어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, this.fileOIds[`file3`])

      /**
       * 1. extraDirs
       *   1-1. 배열 길이가 1인가?
       *   1-2. 부모폴더 잘 들어왔나?
       *   1-3. 부모폴더의 자식폴더 배열 길이 0인가?
       *   1-4. 부모폴더의 자식파일 배열 길이 2인가?
       */

      // 1-1. 배열 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. extraDirs 배열 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. 부모폴더 잘 들어왔나?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `1-2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }
      if (!_parentDir) {
        throw `1-2. 부모폴더가 들어오지 않았다.`
      }

      // 1-3. 부모폴더의 자식폴더 배열 길이 0인가?
      if (_parentDir.subDirOIdsArr.length !== 3) {
        throw `1-3. 부모폴더의 자식폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 1-4. 부모폴더의 자식파일 배열 길이 2인가?
      if (_parentDir.fileOIdsArr.length !== 2) {
        throw `1-4. 부모폴더의 자식파일 배열 길이가 2가 아닌 ${_parentDir.fileOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열 길이가 2인가?
       *   2-2. 배열에 1~2 번째 요소가 들어가있는가?
       */

      // 2-1. 배열 길이가 2인가?
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. extraFileRows 배열 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. 배열에 1~2 번째 요소가 들어가있는가?
      const fileIdxs = [1, 2]
      for (let i = 0; i < extraFileRows.fileOIdsArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== this.fileOIds[`file${fileIdxs[i]}`]) {
          throw `2-2. 배열의 ${i}번째 원소가 ${this.fileOIds[`file${fileIdxs[i]}`]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 3. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget = [this.fileOIds[`file3`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `3. 실제로 삭제가 되지 않았다.`
      }

      // 4. 나머지 폴더들에 있는 같은 이름의 파일이 남아있는지 확인

      // dir1에 있던 중복된 이름의 파일이 남아있는지 확인
      const queryTarget5 = `SELECT * FROM files WHERE fileName = ? AND dirOId = ?`
      const paramTarget5 = [`file3`, this.dirOIds[`dir1`]]
      const [_result5] = await db.execute(queryTarget5, paramTarget5)
      const _resultArr5 = _result5 as RowDataPacket[]
      if (_resultArr5.length !== 1) {
        throw `4. dir1에 있던 중복된 이름의 파일이 1개가 아니다. ${_resultArr5.length} 개이다.`
      }

      // dir2에 있던 중복된 이름의 파일이 남아있는지 확인
      const queryTarget6 = `SELECT * FROM files WHERE fileName = ? AND dirOId = ?`
      const paramTarget6 = [`file3`, this.dirOIds[`dir2`]]
      const [_result6] = await db.execute(queryTarget6, paramTarget6)
      const _resultArr6 = _result6 as RowDataPacket[]
      if (_resultArr6.length !== 1) {
        throw `4. dir2에 있던 중복된 이름의 파일이 1개가 아니다. ${_resultArr6.length} 개이다.`
      }

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_DeleteFileAgain(db: mysql.Pool, logLevel: number) {
    /**
     * 테스트 폴더의 맨 앞 파일을 중복으로 삭제한다.
     *
     * 점검사항
     *   1. extraDirs
     *   2. extraFileRows
     *   3. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   4. 또 삭제를 시도했을때 의도한 에러가 뜨는가?
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, this.fileOIds[`file1`])

      /**
       * 1. extraDirs
       *   1-1. 배열 길이가 1인가?
       *   1-2. 부모폴더 잘 들어왔나?
       *   1-3. 부모폴더의 자식폴더 배열 길이 0인가?
       *   1-4. 부모폴더의 자식파일 배열 길이 2인가?
       */

      // 1-1. 배열 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. extraDirs 배열 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. 부모폴더 잘 들어왔나?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `1-2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }
      if (!_parentDir) {
        throw `1-2. 부모폴더가 들어오지 않았다.`
      }

      // 1-3. 부모폴더의 자식폴더 배열 길이 0인가?
      if (_parentDir.subDirOIdsArr.length !== 3) {
        throw `1-3. 부모폴더의 자식폴더 배열 길이가 3이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 1-4. 부모폴더의 자식파일 배열 길이 1인가?
      if (_parentDir.fileOIdsArr.length !== 1) {
        throw `1-4. 부모폴더의 자식파일 배열 길이가 1이 아닌 ${_parentDir.fileOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열 길이가 1인가?
       *   2-2. 배열에 2 번째 요소가 들어가있는가?
       */

      // 2-1. 배열 길이가 1인가?
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. extraFileRows 배열 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. 배열에 2 번째 요소가 들어가있는가?
      const fileIdxs = [2]
      for (let i = 0; i < extraFileRows.fileOIdsArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== this.fileOIds[`file${fileIdxs[i]}`]) {
          throw `2-2. 배열의 ${i}번째 원소가 ${this.fileOIds[`file${fileIdxs[i]}`]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 3. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM files WHERE fileOId = ? AND dirOId = ?`
      const paramTarget = [this.fileOIds[`file1`], this.dirOIds[`root`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `3. 실제로 삭제가 되지 않았다.`
      }

      // 4. 또 삭제를 시도했을때 의도한 에러가 뜨는가?
      try {
        await this.portService.deleteFile(jwtPayload, this.fileOIds[`file1`])
        // ::
      } catch (errObj) {
        // ::
        if (errObj.gkdErrCode !== 'FILEDB_deleteFile_InvalidFileOId') {
          throw errObj
        }
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
  const testModule = new WorkingScenario(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
