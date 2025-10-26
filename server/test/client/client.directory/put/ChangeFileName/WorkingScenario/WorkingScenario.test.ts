/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'

import * as mysql from 'mysql2/promise'
import {ClientDirPortServiceTest} from '@module'
import {AUTH_ADMIN} from '@secret'
import * as HTTP from '@httpDataType'
import {FILE_NAME_MAX_LENGTH} from '@commons/values'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - client.directory 의 ChangeFileName 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - 루트 폴더에 폴더를 하나 쿼리로 생성한다.
 *   - 이 폴더에 파일을 2개 만든다.
 *   - 기본적으로 0번째 파일에 대해서 실행한다.
 *
 * 시나리오
 *   1. 단순 파일명 변경 - 유효한 일반 파일명으로 변경
 *   2. 특수문자가 포함된 파일명으로 변경 (예: test-file_2024.md)
 *   3. 숫자만으로 이루어진 파일명으로 변경
 *   4. 한글 파일명으로 변경
 *   5. 영어, 숫자, 한글이 섞인 파일명으로 변경
 *   6. 최대 길이 파일명으로 변경
 *   7. 1글자 파일명으로 변경
 *   8. 같은 파일을 여러 번 연속으로 다른 이름으로 변경해도 정상 작동하는지 확인
 */
export class WorkingScenario extends GKDTestBase {
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOId: string = ''
  private fileOId0: string = ''
  private fileOId1: string = ''

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    try {
      const {dirOId: rootDirOId} = this.testDB.getRootDir().directory
      const {directory} = await this.testDB.createDirectoryLight(rootDirOId, this.constructor.name)
      const {dirOId} = directory

      const {file} = await this.testDB.createFileLight(dirOId, 'file0')
      const {file: file1} = await this.testDB.createFileLight(dirOId, 'file1')

      this.dirOId = dirOId
      this.fileOId0 = file.fileOId
      this.fileOId1 = file1.fileOId
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this._1_simpleFileNameChange()
      await this._2_specialCharacterFileName()
      await this._3_numericOnlyFileName()
      await this._4_koreanFileName()
      await this._5_mixedLanguageFileName()
      await this._6_maxLengthFileName()
      await this._7_singleCharacterFileName()
      await this._8_multipleConsecutiveChanges()
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    try {
      if (this.dirOId) {
        await this.testDB.deleteDirectoryLight(this.dirOId)
      }
      if (this.fileOId0) {
        await this.testDB.deleteFileLight(this.fileOId0)
      }
      if (this.fileOId1) {
        await this.testDB.deleteFileLight(this.fileOId1)
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _1_simpleFileNameChange() {
    /**
     * 유효한 일반 파일명으로 변경
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = 'changedFileName'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _2_specialCharacterFileName() {
    /**
     * 특수문자가 포함된 파일명으로 변경 (예: test-file_2024.md)
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = 'test-file_2024.md'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _3_numericOnlyFileName() {
    /**
     * 숫자만으로 이루어진 파일명으로 변경
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = '123456789'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _4_koreanFileName() {
    /**
     * 한글 파일명으로 변경
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = '한글파일명'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _5_mixedLanguageFileName() {
    /**
     * 영어, 숫자, 한글이 섞인 파일명으로 변경
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = 'test파일123'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _6_maxLengthFileName() {
    /**
     * 최대 길이 파일명으로 변경 (40자)
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = '가'.repeat(FILE_NAME_MAX_LENGTH) // 40자 파일명
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _7_singleCharacterFileName() {
    /**
     * 1글자 파일명으로 변경
     *
     * 점검사항
     *   1. extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const newFileName = 'x'
      const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

      // 파일명 변경 실행
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

      /**
       * 1. extraDirs
       *   1-1. 배열의 길이가 0인지
       */
      if (extraDirs.dirOIdsArr.length !== 0) {
        throw `1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      /**
       * 2. extraFileRows
       *   2-1. 배열의 길이가 1인지
       *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
       */
      if (extraFileRows.fileOIdsArr.length !== 1) {
        throw `2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }
      const fileOid = extraFileRows.fileOIdsArr[0]
      if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
        throw `2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
      }
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  private async _8_multipleConsecutiveChanges() {
    /**
     * 같은 파일을 여러 번 연속으로 다른 이름으로 변경해도 정상 작동하는지 확인
     *
     * 점검사항
     *   1. 각 변경마다 extraDirs
     *     1-1. 배열의 길이가 0인지
     *   2. 각 변경마다 extraFileRows
     *     2-1. 배열의 길이가 1인지
     *     2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
     */
    try {
      const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
      const fileNames = ['firstChange', 'secondChange', 'thirdChange', 'finalChange']

      for (let i = 0; i < fileNames.length; i++) {
        const newFileName = fileNames[i]
        const data: HTTP.ChangeFileNameType = {fileOId: this.fileOId0, fileName: newFileName}

        // 파일명 변경 실행
        const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)

        /**
         * 1. extraDirs
         *   1-1. 배열의 길이가 0인지
         */
        if (extraDirs.dirOIdsArr.length !== 0) {
          throw `${i + 1}번째 변경: 1-1. 배열의 길이가 0이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
        }

        /**
         * 2. extraFileRows
         *   2-1. 배열의 길이가 1인지
         *   2-2. 배열의 0번째 요소에 본인 이름이 잘 들어갔는지
         */
        if (extraFileRows.fileOIdsArr.length !== 1) {
          throw `${i + 1}번째 변경: 2-1. 배열의 길이가 1이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
        }
        const fileOid = extraFileRows.fileOIdsArr[0]
        if (extraFileRows.fileRows[fileOid].fileName !== newFileName) {
          throw `${i + 1}번째 변경: 2-2. 배열의 0번째 요소에 ${newFileName} 이 아닌 ${extraFileRows.fileRows[fileOid].fileName} 이다.`
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
