import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

export async function _1_FrontToMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-1. 0번째 디렉토리의 자식순서를 1234056789 로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_0'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _2_MiddleToFront(db: mysql.Pool, logLevel: number) {
  /**
   * 1-2. 0번째 디렉토리의 자식순서를 0123456789 로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_0'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _3_FrontToBack(db: mysql.Pool, logLevel: number) {
  /**
   * 1-3. 0번째 디렉토리의 자식순서를 1234567890 으로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9'],
      this.dirOIds['dir0_0']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_0'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _4_BackToFront(db: mysql.Pool, logLevel: number) {
  /**
   * 1-4. 0번째 디렉토리의 자식순서를 0123456789 으로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_0'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _5_MiddleToBack(db: mysql.Pool, logLevel: number) {
  /**
   * 1-5. 0번째 디렉토리의 자식순서를 0123467895 으로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9'],
      this.dirOIds['dir0_5']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_5'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
export async function _6_BackToMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-6. 0번째 디렉토리의 자식순서를 0123456789 으로 변경한다.
   *
   * 점검사항
   *   1. extraDirs 길이가 11인가?
   *   2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
   *   3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)

    const newChildArr = [
      this.dirOIds['dir0_0'],
      this.dirOIds['dir0_1'],
      this.dirOIds['dir0_2'],
      this.dirOIds['dir0_3'],
      this.dirOIds['dir0_4'],
      this.dirOIds['dir0_5'],
      this.dirOIds['dir0_6'],
      this.dirOIds['dir0_7'],
      this.dirOIds['dir0_8'],
      this.dirOIds['dir0_9']
    ]

    const data: HTTP.MoveDirectoryType = {
      moveDirOId: this.dirOIds['dir0_5'],
      oldParentDirOId: this.dirOIds['dir0'],
      oldParentChildArr: newChildArr,
      newParentDirOId: this.dirOIds['dir0'],
      newParentChildArr: newChildArr
    }
    const {extraDirs} = await this.portService.moveDirectory(jwtPayload, data)

    // 1. extraDirs 길이가 11인가?
    if (extraDirs.dirOIdsArr.length !== 11) {
      throw `1. extraDirs 길이가 11이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
    }

    // 2. extraDirs 의 첫 번째 dirOId 가 0번째 디렉토리가 맞는가?
    if (extraDirs.dirOIdsArr[0] !== this.dirOIds['dir0']) {
      throw `2. 배열의 0번째 원소가 ${this.dirOIds['dir0']} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
    }

    // 3. extraDirs 의 두 번째부터 11번째 까지의 dirOId 값이 변경한 순서가 맞는가?
    for (let i = 1; i < 11; i++) {
      if (extraDirs.dirOIdsArr[i] !== newChildArr[i - 1]) {
        throw `3. 배열의 ${i}번째 원소가 ${newChildArr[i - 1]} 이 아닌 ${extraDirs.dirOIdsArr[i]} 이다.`
      }
    }
    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
