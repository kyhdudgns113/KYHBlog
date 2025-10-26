/**
 * import 경로가 /src 로 시작하면 인식 못한다. \
 * - ../../src/~~ 이런식으로 해야한다.
 */
import minimist from 'minimist'
import {exit} from 'process'
import {GKDTestBase} from '@testCommon'
import {consoleColors} from '@util'

import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {ClientDirPortServiceTest} from '@modules/database'
import {AUTH_ADMIN} from '@secret'

import * as SameParent from './SameParent'
import * as GrandSibling from './GrandSibling'
import * as Uncle from './Uncle'

/**
 * 이 클래스의 로그를 출력하기 위해 필요한 로그 레벨의 최소값이다.
 * 클래스의 깊이마다 1씩 수동으로 바꾼다
 */
const DEFAULT_REQUIRED_LOG_LEVEL = 4

/**
 * WorkingScenario
 *   - client.directory 의 MoveDirectory 함수 실행을 테스트한다.
 *   - 정상작동이 잘 되는지 테스트한다.
 *   - 여러 서브 테스트들을 통과해야 하므로 TestOK 로 실행한다.
 *
 * 테스트 준비
 *   - ROOT 라는 이름으로 루트 디렉토리를 쿼리로 직접 만든다.
 *   - ROOT 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
 *   - 각 자식 디렉토리에 자식 디렉토리 10개씩 한번에 생성한다.
 *
 * 시나리오
 *
 *   - 같은 부모폴더
 *       1. 맨 앞에서 가운데로
 *       2. 가운데에서 맨 앞으로
 *       3. 맨 앞에서 맨 뒤로
 *       4. 맨 뒤에서 맨 앞으로
 *       5. 가운데에서 맨 뒤로
 *       6. 맨 뒤에서 가운데로
 *
 *   - 할아버지나 형제의 자식으로 이동
 *       1. 맨 앞에서 할아버지의 맨 앞으로 이동
 *       2. 맨 앞에서 형제의 맨 앞으로 이동
 *       3. 맨 앞에서 할아버지의 가운데로 이동
 *       4. 가운데에서 형제의 맨 앞으로 이동
 *       5. 맨 앞에서 할아버지의 맨 뒤로 이동
 *       6. 맨 뒤에서 형제의 맨 앞으로 이동
 *       7. 가운데에서 할아버지의 맨 앞으로 이동
 *       8. 가운데에서 형제의 가운데로 이동
 *       9. 가운데에서 할아버지의 맨 뒤로 이동
 *       10. 맨 뒤에서 형제의 가운데로 이동
 *       11. 가운데에서 할아버지의 가운데로 이동
 *       12. 가운데에서 형제의 가운데로 이동
 *       13. 맨 뒤에서 할아버지의 맨 앞으로 이동
 *       14. 맨 앞에서 형제의 맨 뒤로 이동
 *       15. 맨 뒤에서 할아버지의 가운데로 이동
 *       16. 가운데에서 형제의 맨 뒤로 이동
 *       17. 맨 뒤에서 할아버지의 맨 뒤로 이동
 *       18. 맨 뒤에서 형제의 맨 뒤로 이동
 *
 *   - 삼촌의 자식으로 이동
 *       1. 가운데에서 삼촌의 맨 앞으로 이동
 *       2. 가운데에서 삼촌의 가운데로 이동
 *       3. 가운데에서 삼촌의 맨 뒤로 이동
 *       4. 맨 뒤에서 삼촌의 맨 앞으로 이동
 *       5. 맨 뒤에서 삼촌의 가운데로 이동
 *       6. 맨 뒤에서 삼촌의 맨 뒤로 이동
 *       7. 맨 앞에서 삼촌의 맨 앞으로 이동
 *       8. 맨 앞에서 삼촌의 가운데로 이동
 *       9. 맨 앞에서 삼촌의 맨 뒤로 이동
 *       10. 마지막 원소를 삼촌의 맨 앞으로 이동
 */
export class WorkingScenario extends GKDTestBase {
  // bind 된 함수들에서 portService 를 쓴다.
  private portService = ClientDirPortServiceTest.clientDirPortService

  private dirOIds = {}

  constructor(REQUIRED_LOG_LEVEL: number) {
    super(REQUIRED_LOG_LEVEL)

    this.dirOIds[`root`] = '00000000000000000000ROOT'

    for (let i = 0; i < 3; i++) {
      this.dirOIds[`dir${i}`] = `00000000000000000000DIR${i}`

      for (let j = 0; j < 10; j++) {
        this.dirOIds[`dir${i}_${j}`] = `000000000000000000DIR${i}_${j}`
      }
    }
  }

  protected async beforeTest(db: mysql.Pool, logLevel: number) {
    const connection = await this.db.getConnection()

    /**
     * 1. ROOT 이름을 가진 루트 디렉토리를 생성한다.
     * 2. 루트 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
     * 3. 각 자식 디렉토리에 자식 디렉토리를 10개 생성한다.
     */
    try {
      // 1. ROOT 이름을 가진 루트 디렉토리를 생성한다.
      const query1 = `
        INSERT INTO directories 
          (dirOId, dirName, dirIdx, parentDirOId, subDirArrLen) 
          VALUES (?, ?, ?, ?, ?)
        `
      const param1 = [this.dirOIds[`root`], 'ROOT', 0, null, 3]
      await connection.execute(query1, param1)

      // 2. 루트 디렉토리에 자식 디렉토리 3개를 한번에 생성한다.
      const query2 = `
        INSERT INTO directories 
          (dirOId, dirName, dirIdx, parentDirOId, subDirArrLen) 
          VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      `
      const param2_1 = [this.dirOIds[`dir0`], 'DIR0', 0, this.dirOIds[`root`], 10]
      const param2_2 = [this.dirOIds[`dir1`], 'DIR1', 1, this.dirOIds[`root`], 10]
      const param2_3 = [this.dirOIds[`dir2`], 'DIR2', 2, this.dirOIds[`root`], 10]
      await connection.execute(query2, [...param2_1, ...param2_2, ...param2_3])

      // 3. 각 자식 디렉토리에 자식 디렉토리 10개씩 한번에 생성한다.
      const childDirCount = 3 // 부모 디렉토리 개수
      const subDirCount = 10 // 각 부모당 자식 디렉토리 개수
      const totalDirCount = childDirCount * subDirCount

      // VALUES 절을 동적으로 생성
      const valuesPattern = '(?, ?, ?, ?)'
      const query3 = `
        INSERT INTO directories 
          (dirOId, dirName, dirIdx, parentDirOId) 
          VALUES ${Array(totalDirCount).fill(valuesPattern).join(', ')}
      `

      // 각 디렉토리(dir0, dir1, dir2)에 대해 10개씩 자식 디렉토리 생성 파라미터 생성
      const param3 = []
      for (let i = 0; i < childDirCount; i++) {
        for (let j = 0; j < subDirCount; j++) {
          param3.push(
            this.dirOIds[`dir${i}_${j}`], // dirOId
            `DIR${i}_${j}`, // dirName
            j, // dirIdx
            this.dirOIds[`dir${i}`] // parentDirOId
          )
        }
      }
      await connection.execute(query3, param3)
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
      await this.memberOK(this.SameParent.bind(this), db, logLevel)
      await this.memberOK(this.GrandSibling.bind(this), db, logLevel)
      await this.memberOK(this.Uncle.bind(this), db, logLevel)

      this.addFinalLog(`[MoveDirectory] WorkingScenario 테스트 미완성`, consoleColors.FgYellow)
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
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  private async SameParent(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(SameParent._1_FrontToMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(SameParent._2_MiddleToFront.bind(this), db, logLevel, 1)
      await this.memberOK(SameParent._3_FrontToBack.bind(this), db, logLevel, 1)
      await this.memberOK(SameParent._4_BackToFront.bind(this), db, logLevel, 1)
      await this.memberOK(SameParent._5_MiddleToBack.bind(this), db, logLevel, 1)
      await this.memberOK(SameParent._6_BackToMiddle.bind(this), db, logLevel, 1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async GrandSibling(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(GrandSibling._1_FrontToGrandFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._2_FrontToSiblingFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._3_FrontToGrandMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._4_MiddleToSiblingFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._5_FrontToGrandBack.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._6_BackToSiblingFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._7_MiddleToGrandFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._8_MiddleToSiblingMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._9_MiddleToGrandBack.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._10_BackToSiblingMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._11_MiddleToGrandMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._12_MiddleToSiblingMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._13_BackToGrandFront.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._14_FrontToSiblingBack.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._15_BackToGrandMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._16_MiddleToSiblingBack.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._17_BackToGrandBack.bind(this), db, logLevel, 1)
      await this.memberOK(GrandSibling._18_BackToSiblingBack.bind(this), db, logLevel, 1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  private async Uncle(db: mysql.Pool, logLevel: number) {
    try {
      await this.memberOK(Uncle._1_MiddleToUncleFront.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._2_MiddleToUncleMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._3_MiddleToUncleBack.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._4_BackToUncleFront.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._5_BackToUncleMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._6_BackToUncleBack.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._7_FrontToUncleFront.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._8_FrontToUncleMiddle.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._9_FrontToUncleBack.bind(this), db, logLevel, 1)
      await this.memberOK(Uncle._10_LastToUncleFront.bind(this), db, logLevel, 1)
      // ::
    } catch (errObj) {
      // ::
      throw errObj // ::
    }
  }
}

if (require.main === module) {
  const argv = minimist(process.argv.slice(2))
  const LOG_LEVEL = argv.LOG_LEVEL || DEFAULT_REQUIRED_LOG_LEVEL
  const testModule = new WorkingScenario(DEFAULT_REQUIRED_LOG_LEVEL) // __Test 대신에 모듈 이름 넣는다.
  testModule.testOK(null, LOG_LEVEL).finally(() => exit()) // NOTE: 이거 OK 인지 Fail 인지 확인
}
