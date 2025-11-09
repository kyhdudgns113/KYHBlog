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
import {AUTH_ADMIN, FILE_NORMAL} from '@secret'

import * as FS from './FatherSon'
import * as SB from './Sibling'
import * as SD from './SameDir'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - client.directory 의 MoveFile 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - ROOT 라는 이름으로 루트 디렉토리를 쿼리로 만든다.
 *   - ROOT 디렉토리에 자식 파일을 10개 만든다.
 *   - ROOT 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
 *   - 각 자식 디렉토리에 자식 파일 10개씩 한번에 생성한다.
 *
 * 시나리오
 *   1. 부모자식간의 이동
 *     1-1. 자식 맨앞 -> 부모 맨앞
 *     1-2. 부모 맨앞 -> 자식 맨앞
 *     1-3. 자식 맨앞 -> 부모 가운데
 *     1-4. 부모 가운데 -> 자식 맨앞
 *     1-5. 자식 맨앞 -> 부모 맨뒤
 *     1-6. 부모 맨뒤 -> 자식 맨앞
 *
 *     1-7. 자식 가운데 -> 부모 맨앞
 *     1-8. 부모 맨앞 -> 자식 가운데
 *     1-9. 자식 가운데 -> 부모 가운데
 *     1-10. 부모 가운데 -> 자식 가운데
 *     1-11. 자식 가운데 -> 부모 맨뒤
 *     1-12. 부모 맨뒤 -> 자식 가운데
 *
 *     1-13. 자식 맨뒤 -> 부모 맨앞
 *     1-14. 부모 맨앞 -> 자식 맨뒤
 *     1-15. 자식 맨뒤 -> 부모 가운데
 *     1-16. 부모 가운데 -> 자식 맨뒤
 *     1-17. 자식 맨뒤 -> 부모 맨뒤
 *     1-18. 부모 맨뒤 -> 자식 맨뒤
 *
 *   2. 형제간의 이동
 *     2-1. 맨앞 -> 0번째 인덱스
 *     2-2. 맨앞 -> null 인덱스
 *     2-3. 맨앞 -> 가운데
 *     2-4. 가운데 -> 맨앞
 *     2-5. 맨앞 -> 맨뒤
 *     2-6. 맨뒤 -> 맨앞
 *
 *     2-7. 가운데 -> 가운데
 *     2-8. 가운데 -> 가운데
 *     2-9. 가운데 -> 맨뒤
 *     2-10. 맨뒤 -> 가운데
 *     2-11. 맨뒤 -> 맨뒤
 *     2-12. 맨뒤 -> 맨뒤
 *
 *   3. 같은 부모 내에서 이동
 *     3-1. 맨앞 -> 가운데
 *     3-2. 가운데 -> 맨앞
 *     3-3. 맨앞 -> 맨뒤
 *     3-4. 맨뒤 -> 맨앞
 *     3-5. 가운데 -> 가운데
 *     3-6. 가운데 -> 맨뒤
 *     3-7. 맨뒤 -> 가운데
 *     3-8. 맨뒤 -> 맨뒤
 *
 */
export class WorkingScenario extends GKDTestBase {
  // bind 된 함수들에서 portService 를 쓴다.
  private portService = ClientDirPortServiceTest.clientDirPortService // [강조] bind 된 함수들에서 portService 를 쓴다.

  private dirOIds = {}
  private fileOIds = {}

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.dirOIds[`root`] = '00000000000000000000ROOT'

    for (let i = 0; i < 10; i++) {
      this.fileOIds[`file${i}`] = `0000000000000000000FILE${i}`
    }

    for (let i = 0; i < 3; i++) {
      this.dirOIds[`dir${i}`] = `00000000000000000000DIR${i}`

      for (let j = 0; j < 10; j++) {
        this.fileOIds[`file${i}_${j}`] = `00000000000000000FILE${i}_${j}`
      }
    }
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()
    /**
     * 1. ROOT 이름을 가진 루트 디렉토리를 생성한다.
     * 2. ROOT 디렉토리에 자식 파일 10개를 한번에 생성한다.
     * 3. 루트 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
     * 4. 각 자식 디렉토리에 자식 파일 10개씩 한번에 생성한다.
     */
    try {
      const {userName, userOId} = this.testDB.getUserCommon(AUTH_ADMIN).user

      // 1. ROOT 이름을 가진 루트 디렉토리를 생성한다.
      const query1 = `
        INSERT INTO directories 
          (dirOId, dirName, dirIdx, parentDirOId, subDirArrLen) 
          VALUES (?, ?, ?, ?, ?)
        `
      const param1 = [this.dirOIds[`root`], 'ROOT', 0, null, 3]
      await connection.execute(query1, param1)

      // 2. ROOT 디렉토리에 자식 파일 10개를 한번에 생성한다.
      const query2 = `
        INSERT INTO files
          (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId)
          VALUES ${Array.from({length: 10}, (_, i) => `(?, ?, ?, ?, ?, ?, ?, ?)`).join(', ')}
      `
      const param2 = []
      for (let i = 0; i < 10; i++) {
        param2.push(this.fileOIds[`file${i}`], '', this.dirOIds[`root`], i, `FILE${i}`, FILE_NORMAL, userName, userOId)
      }
      await connection.execute(query2, param2)
      // ::
      // 3. 루트 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
      const query3 = `
        INSERT INTO directories 
          (dirOId, dirName, dirIdx, parentDirOId, subDirArrLen) 
          VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      `
      const param3_1 = [this.dirOIds[`dir0`], 'DIR0', 0, this.dirOIds[`root`], 0]
      const param3_2 = [this.dirOIds[`dir1`], 'DIR1', 1, this.dirOIds[`root`], 0]
      const param3_3 = [this.dirOIds[`dir2`], 'DIR2', 2, this.dirOIds[`root`], 0]
      await connection.execute(query3, [...param3_1, ...param3_2, ...param3_3])

      // 4. 각 자식 디렉토리에 자식 파일 10개씩 한번에 생성한다.
      const queryFile = `
        INSERT INTO files
          (fileOId, content, dirOId, fileIdx, fileName, fileStatus, userName, userOId)
          VALUES ${Array.from({length: 30}, (_, i) => `(?, ?, ?, ?, ?, ?, ?, ?)`).join(', ')}
      `
      const paramFile: any[] = []

      for (let i = 0; i < 3; i++) {
        const parentDirOId = this.dirOIds[`dir${i}`]

        for (let j = 0; j < 10; j++) {
          paramFile.push(this.fileOIds[`file${i}_${j}`], '', parentDirOId, j, `FILE${i}_${j}`, FILE_NORMAL, userName, userOId)
        }
      }

      await connection.execute(queryFile, paramFile)

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
  protected async execTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(this.FatherSonTest.bind(this), db, logLevel)
      await this.memberOK(this.SiblingTest.bind(this), db, logLevel)
      await this.memberOK(this.SameDirTest.bind(this), db, logLevel)
      this.addFinalLog(`[MoveFile] WorkingScenario 미완성`, consoleColors.FgGreen)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  protected async finishTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()
    try {
      // Foreign Key 설정에 의해 얘만 지워도 나머지는 알아서 지워진다.
      if (this.dirOIds['root']) {
        const query = `DELETE FROM directories WHERE dirOId = ?`
        const param = [this.dirOIds['root']]
        await connection.execute(query, param)
      }
      // ::
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

  private async FatherSonTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(FS._1_1_SonFrontToParentFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_2_ParentFrontToSonFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_3_SonFrontToParentMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_4_ParentMiddleToSonFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_5_SonFrontToParentBack.bind(this), db, logLevel)
      await this.memberOK(FS._1_6_ParentBackToSonFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_7_SonMiddleToParentFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_8_ParentFrontToSonMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_9_SonMiddleToParentMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_10_ParentMiddleToSonMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_11_SonMiddleToParentBack.bind(this), db, logLevel)
      await this.memberOK(FS._1_12_ParentBackToSonMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_13_SonBackToParentFront.bind(this), db, logLevel)
      await this.memberOK(FS._1_14_ParentFrontToSonBack.bind(this), db, logLevel)
      await this.memberOK(FS._1_15_SonBackToParentMiddle.bind(this), db, logLevel)
      await this.memberOK(FS._1_16_ParentMiddleToSonBack.bind(this), db, logLevel)
      await this.memberOK(FS._1_17_SonBackToParentBack.bind(this), db, logLevel)
      await this.memberOK(FS._1_18_ParentBackToSonBack.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async SiblingTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(SB._2_1_Dir0FrontToDir1Idx0.bind(this), db, logLevel)
      await this.memberOK(SB._2_2_Dir1FrontToDir0IdxNull.bind(this), db, logLevel)
      await this.memberOK(SB._2_3_Dir0FrontToDir1Middle.bind(this), db, logLevel)
      await this.memberOK(SB._2_4_Dir1MiddleToDir0Front.bind(this), db, logLevel)
      await this.memberOK(SB._2_5_Dir0FrontToDir1Back.bind(this), db, logLevel)
      await this.memberOK(SB._2_6_Dir1BackToDir0Front.bind(this), db, logLevel)
      await this.memberOK(SB._2_7_Dir0MiddleToDir1Middle.bind(this), db, logLevel)
      await this.memberOK(SB._2_8_Dir1MiddleToDir0Middle.bind(this), db, logLevel)
      await this.memberOK(SB._2_9_Dir0MiddleToDir1Back.bind(this), db, logLevel)
      await this.memberOK(SB._2_10_Dir1BackToDir0Middle.bind(this), db, logLevel)
      await this.memberOK(SB._2_11_Dir0BackToDir1Back.bind(this), db, logLevel)
      await this.memberOK(SB._2_12_Dir1BackToDir0Back.bind(this), db, logLevel)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async SameDirTest(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(SD._3_1_FrontToMiddle.bind(this), db, logLevel)
      await this.memberOK(SD._3_2_MiddleToFront.bind(this), db, logLevel)
      await this.memberOK(SD._3_3_FrontToBack.bind(this), db, logLevel)
      await this.memberOK(SD._3_4_BackToFront.bind(this), db, logLevel)
      await this.memberOK(SD._3_5_MiddleToMiddle.bind(this), db, logLevel)
      await this.memberOK(SD._3_6_MiddleToBack.bind(this), db, logLevel)
      await this.memberOK(SD._3_7_BackToMiddle.bind(this), db, logLevel)
      await this.memberOK(SD._3_8_BackToBack.bind(this), db, logLevel)
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
