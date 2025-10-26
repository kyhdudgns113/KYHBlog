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
import {AUTH_ADMIN, AUTH_GUEST, AUTH_USER} from '@commons/secret'
import * as HTTP from '@httpDataType'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * CheckAuth
 *   - ClientDirectoryPort 의 moveDirectory 함수 실행을 테스트한다.
 *   - 권한이 없는 유저들이 시도하는 경우를 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 루트 폴더에 폴더를 2개 쿼리로 생성한다.
 *   - 각 폴더에 자식폴더 2개를 addDirectory 함수로 생성한다.
 *
 * 서브 테스트
 *   1. 권한이 ADMIN_GUEST, 같은 폴더로 시도하는 경우
 *   2. 권한이 ADMIN_GUEST, 다른 폴더로 시도하는 경우
 *   3. 권한이 ADMIN_USER, 같은 폴더로 시도하는 경우
 *   4. 권한이 ADMIN_USER, 다른 폴더로 시도하는 경우
 */
export class CheckAuth extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId0: string = ''
  private dirOId1: string = ''
  private dirOId0_0: string = ''
  private dirOId0_1: string = ''
  private dirOId1_0: string = ''
  private dirOId1_1: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const dirName = this.constructor.name
      const dirName0 = dirName + '0'
      const dirName1 = dirName + '1'
      const dirName0_0 = dirName + '0_0'
      const dirName0_1 = dirName + '0_1'
      const dirName1_0 = dirName + '1_0'
      const dirName1_1 = dirName + '1_1'

      // 1. 루트 폴더에 폴더를 2개 쿼리로 생성한다.
      const {dirOId: rootDirOId} = this.testDB.getRootDir().directory
      const {directory} = await this.testDB.createDirectoryLight(rootDirOId, dirName0)
      this.dirOId0 = directory.dirOId

      const {directory: directory1} = await this.testDB.createDirectoryLight(rootDirOId, dirName1)
      this.dirOId1 = directory1.dirOId

      // 2. 각 폴더에 자식폴더 2개를 addDirectory 함수로 생성한다.
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

      const {extraDirs: extraDirs0_0} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId0, dirName: dirName0_0})
      this.dirOId0_0 = extraDirs0_0.dirOIdsArr[1]

      const {extraDirs: extraDirs0_1} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId0, dirName: dirName0_1})
      this.dirOId0_1 = extraDirs0_1.dirOIdsArr[1]

      const {extraDirs: extraDirs1_0} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId1, dirName: dirName1_0})
      this.dirOId1_0 = extraDirs1_0.dirOIdsArr[1]

      const {extraDirs: extraDirs1_1} = await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId1, dirName: dirName1_1})
      this.dirOId1_1 = extraDirs1_1.dirOIdsArr[1]
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_Guest_Try_Same_Dir.bind(this), db, logLevel)
      await this.memberFail(this._2_Guest_Try_Other_Dir.bind(this), db, logLevel)
      await this.memberFail(this._3_User_Try_Same_Dir.bind(this), db, logLevel)
      await this.memberFail(this._4_User_Try_Other_Dir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId0, dirOId1} = this

      if (dirOId0) {
        await this.testDB.deleteDirectoryLightSons(dirOId0)
        await this.testDB.deleteDirectoryLight(dirOId0)
      }
      if (dirOId1) {
        await this.testDB.deleteDirectoryLightSons(dirOId1)
        await this.testDB.deleteDirectoryLight(dirOId1)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_Guest_Try_Same_Dir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_GUEST)

      const data: HTTP.MoveDirectoryType = {
        moveDirOId: this.dirOId0,
        oldParentDirOId: this.dirOId0,
        oldParentChildArr: [this.dirOId0_1, this.dirOId0_0],
        newParentDirOId: this.dirOId0,
        newParentChildArr: [this.dirOId0_1, this.dirOId0_0]
      }

      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _2_Guest_Try_Other_Dir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_GUEST)

      const data: HTTP.MoveDirectoryType = {
        moveDirOId: this.dirOId0,
        oldParentDirOId: this.dirOId0,
        oldParentChildArr: [this.dirOId0_0],
        newParentDirOId: this.dirOId1,
        newParentChildArr: [this.dirOId0_1, this.dirOId1_1, this.dirOId1_0]
      }
      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _3_User_Try_Same_Dir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)

      const data: HTTP.MoveDirectoryType = {
        moveDirOId: this.dirOId0,
        oldParentDirOId: this.dirOId0,
        oldParentChildArr: [this.dirOId0_1, this.dirOId0_0],
        newParentDirOId: this.dirOId0,
        newParentChildArr: [this.dirOId0_1, this.dirOId0_0]
      }

      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
  private async _4_User_Try_Other_Dir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_USER)

      const data: HTTP.MoveDirectoryType = {
        moveDirOId: this.dirOId0,
        oldParentDirOId: this.dirOId0,
        oldParentChildArr: [this.dirOId0_0],
        newParentDirOId: this.dirOId1,
        newParentChildArr: [this.dirOId0_1, this.dirOId1_1, this.dirOId1_0]
      }
      await this.portService.moveDirectory(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DBHUB_checkAuthAdmin_noAuth') {
        return this.logErrorObj(errObj, 2)
      }
      throw errObj
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new CheckAuth(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
