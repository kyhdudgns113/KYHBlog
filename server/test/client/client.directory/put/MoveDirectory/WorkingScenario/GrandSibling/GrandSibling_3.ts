import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

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
 *   2. 할아버지나 형제의 자식으로 이동
 *     2-13. 맨 뒤에서 할아버지의 맨 앞으로 이동
 *     2-14. 맨 앞에서 형제의 맨 뒤로 이동
 *     2-15. 맨 뒤에서 할아버지의 가운데로 이동
 *     2-16. 가운데에서 형제의 맨 뒤로 이동
 *     2-17. 맨 뒤에서 할아버지의 맨 뒤로 이동
 *     2-18. 맨 뒤에서 형제의 맨 뒤로 이동
 */

export async function _13_BackToGrandFront(db: mysql.Pool, logLevel: number) {
  /**
   * 2-13. 맨 뒤에서 할아버지의 맨 앞으로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_9']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_3'],
      this.dirOIds['dir2_4'],
      this.dirOIds['dir2_5'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8']
    ]

    const newParentDirOId = this.dirOIds['root']
    const newParentChildArr = [
      this.dirOIds['dir2_9'], // ::
      this.dirOIds['dir0'],
      this.dirOIds['dir1'],
      this.dirOIds['dir2']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[10] !== newParentDirOId) {
      throw `5. 배열의 10번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[10]} 이다.`
    }
    // 6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 11]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 11]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _14_FrontToSiblingBack(db: mysql.Pool, logLevel: number) {
  /**
   * 2-14. 맨 앞에서 형제의 맨 뒤로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_9']

    const newParentDirOId = this.dirOIds['dir2']
    const newParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_3'],
      this.dirOIds['dir2_4'],
      this.dirOIds['dir2_5'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8'],
      this.dirOIds['dir2_9']
    ]

    const oldParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [this.dirOIds['dir0'], this.dirOIds['dir1'], this.dirOIds['dir2']]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[4] !== newParentDirOId) {
      throw `5. 배열의 4번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[4]} 이다.`
    }
    // 6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 5]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 5]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _15_BackToGrandMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 2-15. 맨 뒤에서 할아버지의 가운데로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir1_9']

    const oldParentDirOId = this.dirOIds['dir1']
    const oldParentChildArr = [
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8']
    ]

    const newParentDirOId = this.dirOIds['root']
    const newParentChildArr = [
      this.dirOIds['dir0'],
      this.dirOIds['dir1_9'], // ::
      this.dirOIds['dir1'],
      this.dirOIds['dir2']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[10] !== newParentDirOId) {
      throw `5. 배열의 10번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[10]} 이다.`
    }
    // 6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 11]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 11]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _16_MiddleToSiblingBack(db: mysql.Pool, logLevel: number) {
  /**
   * 2-16. 가운데에서 형제의 맨 뒤로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir1_9']

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'] // ::
    ]

    const oldParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [this.dirOIds['dir0'], this.dirOIds['dir1'], this.dirOIds['dir2']]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[4] !== newParentDirOId) {
      throw `5. 배열의 4번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[4]} 이다.`
    }
    // 6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 5]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 5]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _17_BackToGrandBack(db: mysql.Pool, logLevel: number) {
  /**
   * 2-17. 맨 뒤에서 할아버지의 맨 뒤로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir0_9']

    const oldParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8']
    ]

    const newParentDirOId = this.dirOIds['root']
    const newParentChildArr = [
      this.dirOIds['dir0'],
      this.dirOIds['dir1'],
      this.dirOIds['dir2'],
      this.dirOIds['dir0_9'] // ::
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 10; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[10] !== newParentDirOId) {
      throw `5. 배열의 10번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[10]} 이다.`
    }
    // 6. extraDirs 의 11번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 11]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 11번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 11; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 11]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _18_BackToSiblingBack(db: mysql.Pool, logLevel: number) {
  /**
   * 2-18. 맨 뒤에서 형제의 맨 뒤로 이동
   *
   * 점검사항
   *   1. extraDirs 길이가 15인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir0_9']

    const newParentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9'] // ::
    ]

    const oldParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [this.dirOIds['dir0'], this.dirOIds['dir1'], this.dirOIds['dir2']]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 15인가?
    if (extraDirs.dirOIdsArr.length !== 15) {
      throw `1. extraDirs 길이가 15이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 10번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 10번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 11번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[4] !== newParentDirOId) {
      throw `5. 배열의 4번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[4]} 이다.`
    }
    // 6. extraDirs 의 12번째 부터 14번째 dirOId 가 입력값과 일치한가?
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 5]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 12번째 부터 14번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 5; i < 15; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 5]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
