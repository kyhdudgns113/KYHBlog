import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

/**
 * 삼촌의 자식으로 이동 (2번 폴더에서 1번 폴더로 이동)
 *
 * 1. 가운데에서 삼촌의 맨 앞으로 이동
 * 2. 가운데에서 삼촌의 가운데로 이동
 * 3. 가운데에서 삼촌의 맨 뒤로 이동
 * 4. 맨 뒤에서 삼촌의 맨 앞으로 이동
 * 5. 맨 뒤에서 삼촌의 가운데로 이동
 * 6. 맨 뒤에서 삼촌의 맨 뒤로 이동
 * 7. 맨 앞에서 삼촌의 맨 앞으로 이동
 * 8. 맨 앞에서 삼촌의 가운데로 이동
 * 9. 맨 앞에서 삼촌의 맨 뒤로 이동
 * 10. 마지막 원소를 삼촌의 맨 앞으로 이동
 * */

export async function _1_MiddleToUncleFront(db: mysql.Pool, logLevel: number) {
  /**
   * 1. 2번째 디렉토리의 5번째 자식을 1번째 디렉토리의 맨 앞으로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 9번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 9번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 10번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 11번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 11번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_5']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_3'],
      this.dirOIds['dir2_4'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8'],
      this.dirOIds['dir2_9']
    ]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_5'], // 맨 앞으로 이동
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
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
    // 6. extraDirs 의 11번째 부터 20번째 dirOId 가 입력값과 일치한가?
    for (let i = 11; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 11]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 11]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 11번째 부터 20번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 11; i < 22; i++) {
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

export async function _2_MiddleToUncleMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 2. 2번째 디렉토리의 4번째 자식을 1번째 디렉토리의 가운데로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 8번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 8번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 9번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 10번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 10번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_4']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_3'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8'],
      this.dirOIds['dir2_9']
    ]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_5'], // 1번 테스트에서 이미 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 가운데로 이동
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 8번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 9; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 8번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 9; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 9번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[9] !== newParentDirOId) {
      throw `5. 배열의 9번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[9]} 이다.`
    }
    // 6. extraDirs 의 10번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 10; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 10]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 10]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 10번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 10; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 10]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 10]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _3_MiddleToUncleBack(db: mysql.Pool, logLevel: number) {
  /**
   * 3. 2번째 디렉토리의 3번째 자식을 1번째 디렉토리의 맨 뒤로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 7번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 7번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 8번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 9번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 9번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_3']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8'],
      this.dirOIds['dir2_9']
    ]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'] // 맨 뒤로 이동
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 7번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 8; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 7번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 8; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 8번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[8] !== newParentDirOId) {
      throw `5. 배열의 8번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[8]} 이다.`
    }
    // 6. extraDirs 의 9번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 9; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 9]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 9]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 9번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 9; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 9]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 9]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _4_BackToUncleFront(db: mysql.Pool, logLevel: number) {
  /**
   * 4. 2번째 디렉토리의 9번째 자식을 1번째 디렉토리의 맨 앞으로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 6번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 6번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 7번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 8번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 8번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_9']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [
      this.dirOIds['dir2_0'],
      this.dirOIds['dir2_1'],
      this.dirOIds['dir2_2'],
      this.dirOIds['dir2_6'],
      this.dirOIds['dir2_7'],
      this.dirOIds['dir2_8']
    ]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_9'], // 맨 앞으로 이동
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'] // 3번 테스트에서 이동한 디렉토리
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 6번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 7; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 6번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 7; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 7번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[7] !== newParentDirOId) {
      throw `5. 배열의 7번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[7]} 이다.`
    }
    // 6. extraDirs 의 8번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 8; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 8]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 8]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 8번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 8; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 8]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 8]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _5_BackToUncleMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 5. 2번째 디렉토리의 8번째 자식을 1번째 디렉토리의 가운데로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 5번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 5번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 6번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 7번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 7번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_8']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [this.dirOIds['dir2_0'], this.dirOIds['dir2_1'], this.dirOIds['dir2_2'], this.dirOIds['dir2_6'], this.dirOIds['dir2_7']]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 가운데로 이동
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'] // 3번 테스트에서 이동한 디렉토리
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 5번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 6; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 5번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 6; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 6번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[6] !== newParentDirOId) {
      throw `5. 배열의 6번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[6]} 이다.`
    }
    // 6. extraDirs 의 7번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 7; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 7]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 7]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 7번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 7; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 7]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 7]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _6_BackToUncleBack(db: mysql.Pool, logLevel: number) {
  /**
   * 6. 2번째 디렉토리의 7번째 자식을 1번째 디렉토리의 맨 뒤로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 4번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 4번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 5번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 6번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 6번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_7']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [this.dirOIds['dir2_0'], this.dirOIds['dir2_1'], this.dirOIds['dir2_2'], this.dirOIds['dir2_6']]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 5번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'], // 3번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_7'] // 맨 뒤로 이동
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 4번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 5; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 4번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 5; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 5번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[5] !== newParentDirOId) {
      throw `5. 배열의 5번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[5]} 이다.`
    }
    // 6. extraDirs 의 6번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 6; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 6]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 6]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 6번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 6; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 6]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 6]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _7_FrontToUncleFront(db: mysql.Pool, logLevel: number) {
  /**
   * 7. 2번째 디렉토리의 0번째 자식을 1번째 디렉토리의 맨 앞으로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 3번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 3번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 4번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 5번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 5번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_0']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [this.dirOIds['dir2_1'], this.dirOIds['dir2_2'], this.dirOIds['dir2_6']]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_0'], // 맨 앞으로 이동
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 5번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'], // 3번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_7'] // 6번 테스트에서 이동한 디렉토리
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 3번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 3번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 4; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 4번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[4] !== newParentDirOId) {
      throw `5. 배열의 4번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[4]} 이다.`
    }
    // 6. extraDirs 의 5번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 5; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 5]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 5]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 5번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 5; i < 22; i++) {
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

export async function _8_FrontToUncleMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 8. 2번째 디렉토리의 1번째 자식을 1번째 디렉토리의 가운데로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 부터 2번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 부터 2번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 3번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 4번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 4번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_1']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [this.dirOIds['dir2_2'], this.dirOIds['dir2_6']]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_0'], // 7번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 5번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_1'], // 가운데로 이동
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'], // 3번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_7'] // 6번 테스트에서 이동한 디렉토리
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 부터 2번째 dirOId 가 입력값과 일치한가?
    for (let i = 1; i < 3; i++) {
      if (extraDirs.dirOIdsArr[i] !== oldParentChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${oldParentChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 4. extraDirs 의 1번째 부터 2번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    for (let i = 1; i < 3; i++) {
      if (extraDirs.dirOIdsArr[i] !== prevParentDir.subDirOIdsArr[i - 1]) {
        throw `4. 배열의 ${i}번째 원소가 ${prevParentDir.subDirOIdsArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }

    // 5. extraDirs 의 3번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[3] !== newParentDirOId) {
      throw `5. 배열의 3번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[3]} 이다.`
    }
    // 6. extraDirs 의 4번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 4; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 4]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 4]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 4번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 4; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 4]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 4]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _9_FrontToUncleBack(db: mysql.Pool, logLevel: number) {
  /**
   * 9. 2번째 디렉토리의 2번째 자식을 1번째 디렉토리의 맨 뒤로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 dirOId 가 입력값과 일치한가?
   *   4. extraDirs 의 1번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
   *   5. extraDirs 의 2번째 dirOId 가 새로운 부모 디렉토리인가?
   *   6. extraDirs 의 3번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   7. extraDirs 의 3번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_2']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr = [this.dirOIds['dir2_6']]

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_0'], // 7번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 5번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_1'], // 8번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'], // 3번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_7'], // 6번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_2'] // 맨 뒤로 이동
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }
    // 3. extraDirs 의 1번째 dirOId 가 입력값과 일치한가?
    if (extraDirs.dirOIdsArr[1] !== oldParentChildArr[0]) {
      throw `3. 배열의 1번째 원소가 ${oldParentChildArr[0]} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
    }
    // 4. extraDirs 의 1번째 dirOId 가 부모 디렉토리의 자식 순서와 일치하는가?
    const prevParentDir = extraDirs.directories[oldParentDirOId]
    if (extraDirs.dirOIdsArr[1] !== prevParentDir.subDirOIdsArr[0]) {
      throw `4. 배열의 1번째 원소가 ${prevParentDir.subDirOIdsArr[0]} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
    }

    // 5. extraDirs 의 2번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[2] !== newParentDirOId) {
      throw `5. 배열의 2번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[2]} 이다.`
    }
    // 6. extraDirs 의 3번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 3; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 3]) {
        throw `6. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 3]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 7. extraDirs 의 3번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 3; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 3]) {
        throw `7. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 3]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _10_LastToUncleFront(db: mysql.Pool, logLevel: number) {
  /**
   * 10. 2번째 디렉토리의 6번째 자식을 1번째 디렉토리의 맨 앞으로 이동한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 22인가?
   *   2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
   *   3. extraDirs 의 1번째 dirOId 가 새로운 부모 디렉토리인가?
   *   4. extraDirs 의 2번째 부터 21번째 dirOId 가 입력값과 일치한가?
   *   5. extraDirs 의 2번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const moveDirOId = this.dirOIds['dir2_6']

    const oldParentDirOId = this.dirOIds['dir2']
    const oldParentChildArr: string[] = []

    const newParentDirOId = this.dirOIds['dir1']
    const newParentChildArr = [
      this.dirOIds['dir2_6'], // 맨 앞으로 이동
      this.dirOIds['dir2_0'], // 7번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_9'], // 4번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_5'], // 1번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_0'],
      this.dirOIds['dir1_1'],
      this.dirOIds['dir1_2'],
      this.dirOIds['dir1_3'],
      this.dirOIds['dir2_4'], // 2번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_8'], // 5번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_1'], // 8번 테스트에서 이동한 디렉토리
      this.dirOIds['dir1_4'],
      this.dirOIds['dir1_5'],
      this.dirOIds['dir1_6'],
      this.dirOIds['dir1_7'],
      this.dirOIds['dir1_8'],
      this.dirOIds['dir1_9'],
      this.dirOIds['dir2_3'], // 3번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_7'], // 6번 테스트에서 이동한 디렉토리
      this.dirOIds['dir2_2'] // 9번 테스트에서 이동한 디렉토리
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 22인가?
    if (extraDirs.dirOIdsArr.length !== 22) {
      throw `1. extraDirs 길이가 22이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
      throw `2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 1번째 dirOId 가 새로운 부모 디렉토리인가?
    if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
      throw `3. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
    }
    // 4. extraDirs 의 2번째 부터 21번째 dirOId 가 입력값과 일치한가?
    for (let i = 2; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentChildArr[i - 2]) {
        throw `4. 배열의 ${i}번째 원소가 ${newParentChildArr[i - 2]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // 5. extraDirs 의 2번째 부터 21번째 dirOId 가 새로운 부모 디렉토리의 자식 순서와 일치하는가?
    const newParentDir = extraDirs.directories[newParentDirOId]
    for (let i = 2; i < 22; i++) {
      if (extraDirs.dirOIdsArr[i] !== newParentDir.subDirOIdsArr[i - 2]) {
        throw `5. 배열의 ${i}번째 원소가 ${newParentDir.subDirOIdsArr[i - 2]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
