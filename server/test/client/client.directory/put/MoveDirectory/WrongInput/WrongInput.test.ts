/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_ADMIN} from '@secret'
import * as T from '@type'
import * as HTTP from '@httpDataType'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - client.directory 의 MoveDirectory 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 테스트 준비
 *   - 루트 폴더에 폴더를 2개 쿼리로 생성한다.
 *   - 0번째 폴더에는 자식폴더 2개, 1번째 폴더에는 자식폴더 3개를 addDirectory 함수로 생성한다.
 *     + 1번째의 2번째 자식폴더의 이름은 0_0으로 한다(중복 테스트)
 *
 * 서브 테스트
 *   1. 기존 디렉토리가 존재하지 않을때
 *   2. 목적지 디렉토리가 존재하지 않을때
 *   3. 기존 디렉토리의 자식 목록중 존재하지 않는 디렉토리가 존재할때
 *   4. 목적지 디렉토리의 자식 목록중 존재하지 않는 디렉토리가 존재할때
 *
 *   5. 이동하려는 디렉토리가 존재하지 않을때
 *   6. 자식 디렉토리로 이동하려고 할 때
 *   7. 목적지 디렉토리에 이름이 같은 디렉토리가 있을때(중복 테스트)
 *   8. 같은 디렉토리 내에서 이동하는데 자식폴더 배열을 다르게 입력한 경우
 *
 *   9. 기존 부모폴더의 자식목록에 중복이 있는경우.
 *   10. 새로운 부모폴더의 자식목록에 중복이 있는경우.
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId0: string = ''
  private dirOId1: string = ''
  private dirOId0_0: string = ''
  private dirOId0_0_0: string = ''
  private dirOId0_1: string = ''
  private dirOId1_0: string = ''
  private dirOId1_1: string = ''
  private dirOIdDuplicate: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const dirName = this.constructor.name
      const dirName0 = dirName + '0'
      const dirName1 = dirName + '1'
      const dirName0_0 = dirName + '0_0'
      const dirName0_0_0 = dirName + '0_0_0'
      const dirName0_1 = dirName + '0_1'
      const dirName1_0 = dirName + '1_0'
      const dirName1_1 = dirName + '1_1'
      const dirNameDuplicate = dirName + '0_0'

      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId: rootDirOId} = this.testDB.getRootDir().directory

      // 1. 루트 폴더에 폴더를 2개 쿼리로 생성한다.
      const {directory} = await this.testDB.createDirectoryLight(rootDirOId, dirName0)
      this.dirOId0 = directory.dirOId

      const {directory: directory1} = await this.testDB.createDirectoryLight(rootDirOId, dirName1)
      this.dirOId1 = directory1.dirOId

      // 2. 각 폴더에 자식폴더 2개를 addDirectory 함수로 생성한다.
      const {extraDirs: extraDirs0_0} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId0, dirName: dirName0_0})
      this.dirOId0_0 = extraDirs0_0.dirOIdsArr[1]

      const {extraDirs: extraDirs0_0_0} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId0_0, dirName: dirName0_0_0})
      this.dirOId0_0_0 = extraDirs0_0_0.dirOIdsArr[1]

      const {extraDirs: extraDirs0_1} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId0, dirName: dirName0_1})
      this.dirOId0_1 = extraDirs0_1.dirOIdsArr[1]

      const {extraDirs: extraDirs1_0} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId1, dirName: dirName1_0})
      this.dirOId1_0 = extraDirs1_0.dirOIdsArr[1]

      const {extraDirs: extraDirs1_1} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId1, dirName: dirName1_1})
      this.dirOId1_1 = extraDirs1_1.dirOIdsArr[1]

      const {extraDirs: extraDirsDuplicate} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId1, dirName: dirNameDuplicate})
      this.dirOIdDuplicate = extraDirsDuplicate.dirOIdsArr[1]

      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_Prev_NotExist.bind(this), db, logLevel)
      await this.memberFail(this._2_New_NotExist.bind(this), db, logLevel)
      await this.memberFail(this._3_Prev_Child_NotExist.bind(this), db, logLevel)
      await this.memberFail(this._4_New_Child_NotExist.bind(this), db, logLevel)

      await this.memberFail(this._5_Move_NotExist.bind(this), db, logLevel)
      await this.memberFail(this._6_Move_To_Descendent.bind(this), db, logLevel)
      await this.memberFail(this._7_Check_Duplicate_Name.bind(this), db, logLevel)
      await this.memberFail(this._8_Check_Different_Child_Arr.bind(this), db, logLevel)

      await this.memberFail(this._9_Check_Duplicate_OldParentChildArr.bind(this), db, logLevel)
      await this.memberFail(this._10_Check_Duplicate_NewParentChildArr.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId0, dirOId1, dirOId0_0_0} = this

      if (dirOId0) {
        await this.testDB.deleteDirectoryLightSons(dirOId0)
        await this.testDB.deleteDirectoryLight(dirOId0)
      }
      if (dirOId1) {
        await this.testDB.deleteDirectoryLightSons(dirOId1)
        await this.testDB.deleteDirectoryLight(dirOId1)
      }
      if (dirOId0_0_0) {
        await this.testDB.deleteDirectoryLightSons(dirOId0_0_0)
        await this.testDB.deleteDirectoryLight(dirOId0_0_0)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_Prev_NotExist(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = '12345678'.repeat(3)
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId0_0, this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveDirectory_InvalidOldParentDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_New_NotExist(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = '12345678'.repeat(3)
      const newParentChildArr = [this.dirOId0_0, this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveDirectory_InvalidNewParentDirOId') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_Prev_Child_NotExist(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1, '12345678'.repeat(3)]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId0_0, this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
    } catch (errObj) {
      // ::
      const possibleErrCode = [
        'CLIENTDIRPORT_moveDirectory_InvalidOldParentChildArrLen', // ::
        'CLIENTDIRPORT_moveDirectory_InvalidOldParentChildArrOver'
      ]
      if (!possibleErrCode.includes(errObj.gkdErrCode)) {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _4_New_Child_NotExist(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId0_0, this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate, '12345678'.repeat(3)]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
    } catch (errObj) {
      // ::
      const possibleErrCode = [
        'CLIENTDIRPORT_moveDirectory_InvalidNewParentChildArrLen', // ::
        'CLIENTDIRPORT_moveDirectory_InvalidNewParentChildArrOver'
      ]
      if (!possibleErrCode.includes(errObj.gkdErrCode)) {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _5_Move_NotExist(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = '12345678'.repeat(3)
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_0, this.dirOId0_1]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate, moveDirOId]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
    } catch (errObj) {
      // ::
      const possibleErrCode = [
        'CLIENTDIRPORT_moveDirectory_InvalidMoveDirOId', // ::
        'CLIENTDIRPORT_moveDirectory_InvalidNewParentChildArrLen',
        'CLIENTDIRPORT_moveDirectory_InvalidOldParentChildArrLen'
      ]
      if (!possibleErrCode.includes(errObj.gkdErrCode)) {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _6_Move_To_Descendent(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = this.dirOId0_0_0
      const newParentChildArr = [moveDirOId]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      const possibleErrCode = ['CLIENTDIRPORT_moveDirectory_InvalidMoveToDescendent']
      if (!possibleErrCode.includes(errObj.gkdErrCode)) {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _7_Check_Duplicate_Name(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId1_0, this.dirOId1_1, this.dirOIdDuplicate, moveDirOId]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_updateDirArr_Dir_Duplicate') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _8_Check_Different_Child_Arr(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_0, this.dirOId0_1]
      const newParentDirOId = this.dirOId0
      const newParentChildArr = [this.dirOId0_1, this.dirOId0_0]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveDirectory_InvalidOldParentChildArrSeq') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }

  private async _9_Check_Duplicate_OldParentChildArr(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId1_0
      const oldParentDirOId = this.dirOId1
      const oldParentChildArr = [this.dirOId1_1, this.dirOId1_1]
      const newParentDirOId = this.dirOId0
      const newParentChildArr = [this.dirOId0_0, this.dirOId0_1, moveDirOId]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveDirectory_InvalidOldParentChildArrOver') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _10_Check_Duplicate_NewParentChildArr(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const moveDirOId = this.dirOId0_0
      const oldParentDirOId = this.dirOId0
      const oldParentChildArr = [this.dirOId0_1]
      const newParentDirOId = this.dirOId1
      const newParentChildArr = [this.dirOId1_0, this.dirOId1_1, this.dirOId1_1, moveDirOId]

      await this.portService.moveDirectory(jwtPayload, {moveDirOId, oldParentDirOId, oldParentChildArr, newParentDirOId, newParentChildArr})
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveDirectory_InvalidNewParentChildArrOver') {
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
