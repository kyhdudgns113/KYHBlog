/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@commons/secret'
import {DIR_NAME_MAX_LENGTH, FILE_NAME_MAX_LENGTH} from '@commons/values'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - client.directory 의 ChangeDirName 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 루트 폴더에 자식 폴더를 하나 직접 생성 쿼리로 만든다.
 *   - 그 폴더에 자식폴더 2개, 자식파일 2개를 만든다.
 *
 * 서브 테스트
 *   1. 이름에 영어만 넣어본다.
 *   2. 이름에 숫자만 넣어본다.
 *   3. 이름에 한글만 넣어본다.
 *   4. 이름에 특수기호만 넣어본다.
 *   5. 이름에 전부 넣어본다.
 *   6. 전부 넣은 이름 앞뒤에 공백 1칸씩 넣어본다.
 *   7. 길이 1 짜리 이름을 넣어본다.
 *   8. 길이 최대치인 이름을 넣어본다.
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    const {dirOId: parentDirOId} = this.testDB.getRootDir().directory
    const dirName = this.constructor.name

    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {directory} = await this.testDB.createDirectoryLight(parentDirOId, dirName)
      this.dirOId = directory.dirOId

      await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId, dirName: 'dir0'})
      await this.portService.addDirectory(jwtPayload, {parentDirOId: this.dirOId, dirName: 'dir1'})
      await this.portService.addFile(jwtPayload, {dirOId: this.dirOId, fileName: 'file0'})
      await this.portService.addFile(jwtPayload, {dirOId: this.dirOId, fileName: 'file1'})
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this._1_englishName.bind(this), db, logLevel)
      await this.memberOK(this._2_numberName.bind(this), db, logLevel)
      await this.memberOK(this._3_koreanName.bind(this), db, logLevel)
      await this.memberOK(this._4_specialName.bind(this), db, logLevel)
      await this.memberOK(this._5_allName.bind(this), db, logLevel)
      await this.memberOK(this._6_allNameWithSpace.bind(this), db, logLevel)
      await this.memberOK(this._7_minLength.bind(this), db, logLevel)
      await this.memberOK(this._8_maxLength.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const {dirOId} = this

    try {
      if (dirOId) {
        const parentDirOId = dirOId
        await this.testDB.deleteFileLightSons(parentDirOId)
        await this.testDB.deleteDirectoryLightSons(parentDirOId)
        await this.testDB.deleteDirectoryLight(dirOId)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_englishName(db: mysql.Pool, logLevel: number) {
    /**
     * 이름에 영어만 넣어본다.
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 1인지
     *     1-2. 배열의 0번째 요소에 본인이 들어왔는지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 2인지
     *     2-2. 배열의 0번째 요소에 본인의 0번째 자식이 들어왔는지
     *     2-3. 배열의 1번째 요소에 본인의 1번째 자식이 들어왔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: 'english'})

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 1인지
       *   1-2. 배열의 0번째 요소에 본인이 들어왔는지
       */

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== 'english') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 2인지
       *   2-2. 배열의 0번째 요소에 본인의 0번째 자식이 들어왔는지
       *   2-3. 배열의 1번째 요소에 본인의 1번째 자식이 들어왔는지
       */
      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // 2-2. 배열의 0번째 요소에 본인의 0번째 자식이 들어왔는지
      if (extraFileRows.fileRows[fileOId_0].fileName !== 'file0') {
        throw `2-2. 배열의 0번째 요소에 본인의 0번째 자식이 아닌 ${extraFileRows.fileRows[fileOId_0].fileName} 이다.`
      }
      // 2-3. 배열의 1번째 요소에 본인의 1번째 자식이 들어왔는지
      if (extraFileRows.fileRows[fileOId_1].fileName !== 'file1') {
        throw `2-3. 배열의 1번째 요소에 본인의 1번째 자식이 아닌 ${extraFileRows.fileRows[fileOId_1].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_numberName(db: mysql.Pool, logLevel: number) {
    /**
     * 이름에 숫자만 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: '12345'})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== '12345') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_koreanName(db: mysql.Pool, logLevel: number) {
    /**
     * 이름에 한글만 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: '한글테스트'})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== '한글테스트') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_specialName(db: mysql.Pool, logLevel: number) {
    /**
     * 이름에 특수기호만 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: '!@#$%'})

      // 1-1. 배열의 길이가 3인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== '!@#$%') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_allName(db: mysql.Pool, logLevel: number) {
    /**
     * 이름에 전부 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: 'english123한글!@#'})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== 'english123한글!@#') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _6_allNameWithSpace(db: mysql.Pool, logLevel: number) {
    /**
     * 전부 넣은 이름 앞뒤에 공백 1칸씩 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: ' english123한글!@# '})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== ' english123한글!@# ') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _7_minLength(db: mysql.Pool, logLevel: number) {
    /**
     * 길이 1 짜리 이름을 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: 'a'})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== 'a') {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }

      const [fileOId_0, fileOId_1] = extraFileRows.fileOIdsArr
      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _8_maxLength(db: mysql.Pool, logLevel: number) {
    /**
     * 길이 최대치(32)인 이름을 넣어본다.
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const {dirOId} = this
      const maxLengthName = '가'.repeat(DIR_NAME_MAX_LENGTH)
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, {dirOId: this.dirOId, dirName: maxLengthName})

      // 1-1. 배열의 길이가 1인지
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `1-1. 배열의 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }
      // 1-2. 배열의 0번째 요소에 본인이 들어왔는지
      if (extraDirs.directories[dirOId].dirName !== maxLengthName) {
        throw `1-2. 배열의 0번째 요소에 본인이 아닌 ${extraDirs.directories[dirOId].dirName} 이다.`
      }
      // 1-3. 이름의 길이가 32인지
      if (extraDirs.directories[dirOId].dirName.length !== DIR_NAME_MAX_LENGTH) {
        throw `1-3. 이름의 길이가 ${DIR_NAME_MAX_LENGTH}가 아닌 ${extraDirs.directories[dirOId].dirName.length} 이다.`
      }

      // 2-1. 배열의 길이가 2인지
      if (extraFileRows.fileOIdsArr.length !== 2) {
        throw `2-1. 배열의 길이가 2이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
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
