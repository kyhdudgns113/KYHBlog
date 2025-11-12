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
 *   - client.directory 의 DeleteDirectory 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 루트 디렉토리에 자식 폴더 1개를 light 버전으로 만든다. (테스트 폴더라고 한다)
 *   - 테스트 폴더에 자식폴더 5개를 full 버전으로 만든다.
 *   - 각 자식폴더에 자식폴더 1개, 자식파일 1개씩 full 버전으로 만든다.
 *
 * 시나리오
 *   1. 맨 앞 자식폴더를 삭제한다.
 *   2. 맨 뒤 자식폴더를 삭제한다.
 *   3. 가운데 자식폴더를 삭제한다.
 *   4. 맨 앞 자식폴더 삭제를 중복으로 한다.
 *   5. 마지막 자식폴더를 삭제한다.
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOIds = {}
  private fileOIds = {}

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.dirOIds[`root`] = ''

    for (let i = 0; i < 5; i++) {
      this.dirOIds[`dir${i}`] = ``

      for (let j = 0; j < 1; j++) {
        this.dirOIds[`dir${i}_${j}`] = ``
        this.fileOIds[`file${i}_${j}`] = ``
      }
    }
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId: rootDirOId} = this.testDB.getRootDir().directory
      const dirName = 'TEST_DIR'
      const {directory} = await this.testDB.createDirectoryLight(rootDirOId, dirName)
      this.dirOIds[`root`] = directory.dirOId

      for (let i = 0; i < 5; i++) {
        const {directory: dir} = await this.testDB.createDirectoryFull(this.dirOIds[`root`], `dir${i}`)
        this.dirOIds[`dir${i}`] = dir.dirOId
        const {directory: dir0} = await this.testDB.createDirectoryFull(this.dirOIds[`dir${i}`], `dir${i}_0`)
        this.dirOIds[`dir${i}_0`] = dir0.dirOId
        const {file} = await this.testDB.createFileFull(this.dirOIds[`dir${i}`], `file${i}_0`)
        this.fileOIds[`file${i}_0`] = file.fileOId
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_DeleteFirstDirectory.bind(this), db, logLevel)
      await this.memberOK(this._2_DeleteLastDirectory.bind(this), db, logLevel)
      await this.memberOK(this._3_DeleteMiddleDirectory.bind(this), db, logLevel)
      await this.memberOK(this._4_DeleteFirstDirectoryDuplicate.bind(this), db, logLevel)
      await this.memberOK(this._5_DeleteLastDirectory.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.testDB.deleteDirectoryLight(this.dirOIds[`root`])
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_DeleteFirstDirectory(db: mysql.Pool, logLevel: number) {
    /**
     * 맨 앞 자식폴더를 삭제한다.
     *
     * 점검사항
     *   1. extraDirs 길이가 1인가?
     *   2. extraDirs 의 배열의 0번쨰 원소가 삭제된 폴더의 부모폴더인가?
     *   3. extraDirs 에 부모폴더가 들어가있는가?
     *   4. 자식폴더 배열 체크
     *     4-1. 배열 길이가 4인가?
     *     4-2. 배열에 1~4 번째 요소가 들어가있는가?
     *   5. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir0`])

      // 1. extraDirs 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 2. extraDirs 의 0번째 원소가 삭제된 폴더의 부모폴더인가?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }

      // 3. extraDirs 에 부모폴더가 들어가있는가?
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (!_parentDir) {
        throw `3. 부모폴더가 들어오지 않았다.`
      }

      // 4-1. 자식폴더 배열 길이가 4인가?
      if (_parentDir.subDirOIdsArr.length !== 4) {
        throw `4-1. 자식폴더 배열 길이가 4가 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 4-2. 자식폴더 배열에 1~4 번째 요소가 들어가있는가?
      const sonIdxs = [1, 2, 3, 4]
      for (let i = 0; i < _parentDir.subDirOIdsArr.length; i++) {
        if (_parentDir.subDirOIdsArr[i] !== this.dirOIds[`dir${sonIdxs[i]}`]) {
          throw `4-2. 자식폴더 배열의 ${i}번째 원소가 ${this.dirOIds[`dir${sonIdxs[i]}`]} 이 아닌 ${_parentDir.subDirOIdsArr[i]} 이다.`
        }
      }

      // 5. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget = [this.dirOIds[`dir0`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `5. 실제로 삭제가 되지 않았다.`
      }

      // 6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
      const queryTarget2 = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir0_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `6. 삭제된 폴더의 자식폴더도 삭제가 되지 않았다.`
      }

      // 7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
      const queryTarget3 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget3 = [this.fileOIds[`file0_0`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 0) {
        throw `7. 삭제된 폴더의 자식파일도 삭제가 되지 않았다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_DeleteLastDirectory(db: mysql.Pool, logLevel: number) {
    /**
     * 맨 뒤 자식폴더를 삭제한다.
     * (1번 테스트에서 dir0이 삭제되었으므로, 현재 남아있는 폴더는 dir1, dir2, dir3, dir4이다)
     *
     * 점검사항
     *   1. extraDirs 길이가 1인가?
     *   2. extraDirs 의 배열의 0번째 원소가 삭제된 폴더의 부모폴더인가?
     *   3. extraDirs 에 부모폴더가 들어가있는가?
     *   4. 자식폴더 배열 체크
     *     4-1. 배열 길이가 3인가?
     *     4-2. 배열에 1~3 번째 요소가 들어가있는가?
     *   5. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir4`])

      // 1. extraDirs 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 2. extraDirs 의 0번째 원소가 삭제된 폴더의 부모폴더인가?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }

      // 3. extraDirs 에 부모폴더가 들어가있는가?
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (!_parentDir) {
        throw `3. 부모폴더가 들어오지 않았다.`
      }

      // 4-1. 자식폴더 배열 길이가 3인가?
      if (_parentDir.subDirOIdsArr.length !== 3) {
        throw `4-1. 자식폴더 배열 길이가 3가 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 4-2. 자식폴더 배열에 1~3 번째 요소가 들어가있는가?
      const sonIdxs = [1, 2, 3]
      for (let i = 0; i < _parentDir.subDirOIdsArr.length; i++) {
        if (_parentDir.subDirOIdsArr[i] !== this.dirOIds[`dir${sonIdxs[i]}`]) {
          throw `4-2. 자식폴더 배열의 ${i}번째 원소가 ${this.dirOIds[`dir${sonIdxs[i]}`]} 이 아닌 ${_parentDir.subDirOIdsArr[i]} 이다.`
        }
      }

      // 5. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget = [this.dirOIds[`dir4`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `5. 실제로 삭제가 되지 않았다.`
      }

      // 6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
      const queryTarget2 = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir4_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `6. 삭제된 폴더의 자식폴더도 삭제가 되지 않았다.`
      }

      // 7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
      const queryTarget3 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget3 = [this.fileOIds[`file4_0`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 0) {
        throw `7. 삭제된 폴더의 자식파일도 삭제가 되지 않았다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_DeleteMiddleDirectory(db: mysql.Pool, logLevel: number) {
    /**
     * 가운데 자식폴더를 삭제한다.
     * (1번 테스트에서 dir0, 2번 테스트에서 dir4가 삭제되었으므로, 현재 남아있는 폴더는 dir1, dir2, dir3이다)
     *
     * 점검사항
     *   1. extraDirs 길이가 1인가?
     *   2. extraDirs 의 배열의 0번째 원소가 삭제된 폴더의 부모폴더인가?
     *   3. extraDirs 에 부모폴더가 들어가있는가?
     *   4. 자식폴더 배열 체크
     *     4-1. 배열 길이가 2인가?
     *     4-2. 배열에 1, 3 번째 요소가 들어가있는가?
     *   5. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir2`])

      // 1. extraDirs 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 2. extraDirs 의 0번째 원소가 삭제된 폴더의 부모폴더인가?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }

      // 3. extraDirs 에 부모폴더가 들어가있는가?
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (!_parentDir) {
        throw `3. 부모폴더가 들어오지 않았다.`
      }

      // 4-1. 자식폴더 배열 길이가 2인가?
      if (_parentDir.subDirOIdsArr.length !== 2) {
        throw `4-1. 자식폴더 배열 길이가 2가 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 4-2. 자식폴더 배열에 1, 3 번째 요소가 들어가있는가?
      const sonIdxs = [1, 3]
      for (let i = 0; i < _parentDir.subDirOIdsArr.length; i++) {
        if (_parentDir.subDirOIdsArr[i] !== this.dirOIds[`dir${sonIdxs[i]}`]) {
          throw `4-2. 자식폴더 배열의 ${i}번째 원소가 ${this.dirOIds[`dir${sonIdxs[i]}`]} 이 아닌 ${_parentDir.subDirOIdsArr[i]} 이다.`
        }
      }

      // 5. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget = [this.dirOIds[`dir2`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `5. 실제로 삭제가 되지 않았다.`
      }

      // 6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
      const queryTarget2 = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir2_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `6. 삭제된 폴더의 자식폴더도 삭제가 되지 않았다.`
      }

      // 7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
      const queryTarget3 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget3 = [this.fileOIds[`file2_0`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 0) {
        throw `7. 삭제된 폴더의 자식파일도 삭제가 되지 않았다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_DeleteFirstDirectoryDuplicate(db: mysql.Pool, logLevel: number) {
    /**
     * 맨 앞에 있던 자식폴더 삭제를 2번 시도한다.
     *   - 같은 자식 폴더를 2번 삭제하려고 시도한다. (중복 삭제)
     *
     * 점검사항
     *   1. extraDirs 길이가 1인가?
     *   2. extraDirs 의 배열의 0번째 원소가 삭제된 폴더의 부모폴더인가?
     *   3. extraDirs 에 부모폴더가 들어가있는가?
     *   4. 자식폴더 배열 체크
     *     4-1. 배열 길이가 1인가?
     *     4-2. 배열에 3 번째 요소가 들어가있는가?
     *   5. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   8. 두 번째 삭제 시도 (중복 삭제 - 에러가 발생해야 함)
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir1`])

      // 1. extraDirs 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 2. extraDirs 의 0번째 원소가 삭제된 폴더의 부모폴더인가?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }

      // 3. extraDirs 에 부모폴더가 들어가있는가?
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (!_parentDir) {
        throw `3. 부모폴더가 들어오지 않았다.`
      }

      // 4-1. 자식폴더 배열 길이가 1인가?
      if (_parentDir.subDirOIdsArr.length !== 1) {
        throw `4-1. 자식폴더 배열 길이가 1이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 4-2. 자식폴더 배열에 3 번째 요소가 들어가있는가?
      const sonIdxs = [3]
      for (let i = 0; i < _parentDir.subDirOIdsArr.length; i++) {
        if (_parentDir.subDirOIdsArr[i] !== this.dirOIds[`dir${sonIdxs[i]}`]) {
          throw `4-2. 자식폴더 배열의 ${i}번째 원소가 ${this.dirOIds[`dir${sonIdxs[i]}`]} 이 아닌 ${_parentDir.subDirOIdsArr[i]} 이다.`
        }
      }

      // 5. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget = [this.dirOIds[`dir1`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `5. 실제로 삭제가 되지 않았다.`
      }

      // 6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
      const queryTarget2 = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir1_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `6. 삭제된 폴더의 자식폴더도 삭제가 되지 않았다.`
      }

      // 7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
      const queryTarget3 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget3 = [this.fileOIds[`file1_0`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 0) {
        throw `7. 삭제된 폴더의 자식파일도 삭제가 되지 않았다.`
      }

      // 8. 두 번째 삭제 시도 (중복 삭제 - 에러가 발생해야 함)
      try {
        await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir1`])
        // ::
      } catch (errObj) {
        // ::
        if (errObj.gkdErrCode !== 'DIRECTORYDB_deleteDir_InvalidDirOId') {
          throw errObj
        }
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_DeleteLastDirectory(db: mysql.Pool, logLevel: number) {
    /**
     * 마지막 자식폴더를 삭제한다.
     * (1번 테스트에서 dir0, 2번 테스트에서 dir4, 3번 테스트에서 dir2, 4번 테스트에서 dir1이 삭제되었으므로, 현재 남아있는 폴더는 dir3이다)
     *
     * 점검사항
     *   1. extraDirs 길이가 1인가?
     *   2. extraDirs 의 배열의 0번째 원소가 삭제된 폴더의 부모폴더인가?
     *   3. extraDirs 에 부모폴더가 들어가있는가?
     *   4. 자식폴더 배열 체크
     *     4-1. 배열 길이가 0인가?
     *   5. 실제로 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     *   7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
     *     - 쿼리로 직접 읽어본다
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {extraDirs} = await this.portService.deleteDirectory(jwtPayload, this.dirOIds[`dir3`])

      // 1. extraDirs 길이가 1인가?
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 2. extraDirs 의 0번째 원소가 삭제된 폴더의 부모폴더인가?
      const _parentDirOId = extraDirs.dirOIdsArr[0]
      if (_parentDirOId !== this.dirOIds[`root`]) {
        throw `2. 배열의 0번째 원소가 ${this.dirOIds[`root`]} 이 아닌 ${_parentDirOId} 이다.`
      }

      // 3. extraDirs 에 부모폴더가 들어가있는가?
      const _parentDir = extraDirs.directories[_parentDirOId]
      if (!_parentDir) {
        throw `3. 부모폴더가 들어오지 않았다.`
      }

      // 4-1. 자식폴더 배열 길이가 0인가?
      if (_parentDir.subDirOIdsArr.length !== 0) {
        throw `4-1. 자식폴더 배열 길이가 0이 아닌 ${_parentDir.subDirOIdsArr.length} 이다.`
      }

      // 5. 실제로 삭제가 되었는가?
      const queryTarget = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget = [this.dirOIds[`dir3`]]
      const [_result] = await db.execute(queryTarget, paramTarget)
      const _resultArr = _result as RowDataPacket[]
      if (_resultArr.length !== 0) {
        throw `5. 실제로 삭제가 되지 않았다.`
      }

      // 6. 삭제된 폴더의 자식폴더도 삭제가 되었는가?
      const queryTarget2 = `SELECT * FROM directories WHERE dirOId = ?`
      const paramTarget2 = [this.dirOIds[`dir3_0`]]
      const [_result2] = await db.execute(queryTarget2, paramTarget2)
      const _resultArr2 = _result2 as RowDataPacket[]
      if (_resultArr2.length !== 0) {
        throw `6. 삭제된 폴더의 자식폴더도 삭제가 되지 않았다.`
      }

      // 7. 삭제된 폴더의 자식파일도 삭제가 되었는가?
      const queryTarget3 = `SELECT * FROM files WHERE fileOId = ?`
      const paramTarget3 = [this.fileOIds[`file3_0`]]
      const [_result3] = await db.execute(queryTarget3, paramTarget3)
      const _resultArr3 = _result3 as RowDataPacket[]
      if (_resultArr3.length !== 0) {
        throw `7. 삭제된 폴더의 자식파일도 삭제가 되지 않았다.`
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
