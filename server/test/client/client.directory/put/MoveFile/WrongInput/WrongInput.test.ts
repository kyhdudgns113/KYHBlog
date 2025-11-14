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

import * as HTTP from '@httpDataType'
import * as ST from '@shareType'
import * as TV from '@testValue'
import {AUTH_ADMIN} from '@commons/values'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WrongInput
 *   - ClientDirectoryPort 의 moveFile 함수 실행을 테스트한다.
 *   - 잘못된 입력값을 넣었을 때 예외가 발생하는지 테스트
 *   - 여러 서브 테스트를 점검해야 하므로 TestOK 로 실행한다
 *
 * 상황
 *   - 루트 폴더에 파일을 2개 Full 버전으로 생성한다.
 *     + 하나는 기본적으로 이동할 파일, 하나는 0번째 폴더의 자식파일이랑 같은 이름으로 생성한다.
 *   - 이 파일을 루트폴더의 0번째 디렉토리로 옮기는것을 테스트한다.
 *
 * 서브 테스트
 *   [공통 입력 검증]
 *   1. `oldParentDirOId` 가 존재하지 않을 때 예외 확인
 *   2. `newParentDirOId` 가 존재하지 않을 때 예외 확인
 *   3. `moveFileOId` 자체가 존재하지 않을 때 예외 확인
 *   4. 이동 대상 파일이 `oldParentChildArr` 이나 `newParentChildArr` 에 포함되지 않은 경우 예외 확인
 *   5. `oldParentChildArr` 에 다른 디렉토리 소속이거나 존재하지 않는 파일 OId 를 섞어 보냈을 때 예외 확인
 *   6. `newParentChildArr` 에 다른 디렉토리 소속이거나 존재하지 않는 파일 OId 를 섞어 보냈을 때 예외 확인
 *
 *   [같은 디렉토리 내 재정렬]
 *   7. 같은 디렉토리에서 순서만 바꾸는데 `oldParentChildArr` 와 `newParentChildArr` 의 길이·순서가 달라지는 경우 예외 확인
 *
 *   [다른 디렉토리로 이동]
 *   8. 다른 디렉토리로 이동하면서 `oldParentChildArr` 에 이동하는 파일이 있을 때 예외 확인
 *   9. 새로운 부모 디렉토리에 동일한 `fileName` 이 이미 있어 UNIQUE 제약이 터지는 경우 예외 확인
 */
export class WrongInput extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private fileOId: string = ''
  private fileOId_sameName: string = ''
  private newParentDir: ST.DirectoryType
  private oldParentDir: ST.DirectoryType

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {directory: oldParentDir} = this.testDB.getRootDir()
      const oldParentDirOId = oldParentDir.dirOId
      const newParentDirOId = oldParentDir.subDirOIdsArr[0]
      const {directory: newParentDir} = this.testDB.getDirectory(newParentDirOId)

      // 기본적으로 이동할 파일 생성
      const fileName = this.constructor.name
      const {file} = await this.testDB.createFileFull(oldParentDirOId, fileName)
      this.fileOId = file.fileOId

      // 중복 이름인 파일 생성
      const fileName_sameName = TV.fileInfo_0.fileName
      const {file: file_sameName} = await this.testDB.createFileFull(oldParentDirOId, fileName_sameName)
      this.fileOId_sameName = file_sameName.fileOId

      // Call By Value 로 불러왔기 때문에 실제 테스트 데이터가 바뀌진 않는다.
      oldParentDir.fileOIdsArr.push(this.fileOId)
      oldParentDir.fileOIdsArr.push(this.fileOId_sameName)

      this.oldParentDir = oldParentDir
      this.newParentDir = newParentDir
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberFail(this._1_OldParentDirOId_NotExists.bind(this), db, logLevel)
      await this.memberFail(this._2_NewParentDirOId_NotExists.bind(this), db, logLevel)
      await this.memberFail(this._3_MoveFileOId_NotExists.bind(this), db, logLevel)
      await this.memberFail(this._4_File_NotInBothParentDir.bind(this), db, logLevel)
      await this.memberFail(this._5_File_ErrorFileInOldParentDir.bind(this), db, logLevel)
      await this.memberFail(this._6_File_ErrorFileInNewParentDir.bind(this), db, logLevel)

      await this.memberFail(this._7_Check_Different_Child_Arr.bind(this), db, logLevel)

      await this.memberFail(this._8_If_File_Exist_In_OldParentChildArr.bind(this), db, logLevel)
      await this.memberFail(this._9_If_File_Exist_In_NewParentDir.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      const {fileOId, fileOId_sameName} = this
      if (fileOId) {
        await this.testDB.deleteFileLight(fileOId)
      }
      if (fileOId_sameName) {
        await this.testDB.deleteFileLight(fileOId_sameName)
      }
      if (fileOId || fileOId_sameName) {
        await this.testDB.resetBaseDB(TV.RESET_FLAG_DIR | TV.RESET_FLAG_FILE)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_OldParentDirOId_NotExists(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: '12345678'.repeat(3),
        oldParentChildArr: oldParentDir.fileOIdsArr.filter(fileOId => fileOId !== this.fileOId),
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: [...newParentDir.fileOIdsArr, fileOId]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoOldParentDir') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _2_NewParentDirOId_NotExists(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr.filter(fileOId => fileOId !== this.fileOId),
        newParentDirOId: '12345678'.repeat(3),
        newParentChildArr: [...newParentDir.fileOIdsArr, fileOId]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoNewParentDir') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _3_MoveFileOId_NotExists(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {newParentDir, oldParentDir} = this
      const fileOId = '12345678'.repeat(3)

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr,
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: [...newParentDir.fileOIdsArr, fileOId]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoFile') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _4_File_NotInBothParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr.filter(fileOId => fileOId !== this.fileOId),
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: newParentDir.fileOIdsArr
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoFileInNewParentChildArr') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _5_File_ErrorFileInOldParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: [...oldParentDir.fileOIdsArr, '12345678'.repeat(3)],
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: newParentDir.fileOIdsArr
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoFileInOldParentDir') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _6_File_ErrorFileInNewParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr,
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: [...newParentDir.fileOIdsArr, '12345678'.repeat(3)]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_NoFileInNewParentDir') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }

  private async _7_Check_Different_Child_Arr(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: [...oldParentDir.fileOIdsArr],
        newParentDirOId: oldParentDir.dirOId,
        newParentChildArr: [fileOId, ...oldParentDir.fileOIdsArr.filter(fileOId => fileOId !== this.fileOId)]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_InvalidOldParentChildArrSeq') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }

  private async _8_If_File_Exist_In_OldParentChildArr(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr,
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: [...newParentDir.fileOIdsArr, fileOId]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'CLIENTDIRPORT_moveFile_FileInOldParentChildArr') {
        return this.logErrorObj(errObj, 2)
      }

      throw errObj
    }
  }
  private async _9_If_File_Exist_In_NewParentDir(db: mysql.Pool, logLevel: number) {
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {fileOId_sameName, newParentDir, oldParentDir} = this

      const data: HTTP.MoveFileType = {
        moveFileOId: fileOId_sameName,
        oldParentDirOId: oldParentDir.dirOId,
        oldParentChildArr: oldParentDir.fileOIdsArr.filter(fileOId => fileOId !== fileOId_sameName),
        newParentDirOId: newParentDir.dirOId,
        newParentChildArr: [...newParentDir.fileOIdsArr, fileOId_sameName]
      }

      await this.portService.moveFile(jwtPayload, data)
      // ::
    } catch (errObj) {
      // ::
      if (errObj.gkdErrCode !== 'DIRECTORYDB_updateDirArr_File_Duplicate') {
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
