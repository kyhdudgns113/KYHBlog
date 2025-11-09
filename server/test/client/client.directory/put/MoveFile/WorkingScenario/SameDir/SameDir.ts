import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

/**
 * MoveFile 함수의 WorkingScenario 테스트중 일부
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
 *   각 테스트마다 다음 사항들을 점검한다
 *     1. extraDirs 점검
 *        - 길이 점검
 *        - oldParentDirOId 가 기존 부모 디렉토리인가?
 *        - oldParentDir 들어왔는지 체크
 *        - oldParentDir 의 자식파일 길이 점검
 *        - oldParentDir 의 자식파일 순서 점검(OID 체크)
 *
 *        - newParentDirOId 가 새로운 부모 디렉토리인가?
 *        - newParentDir 들어왔는지 체크
 *        - newParentDir 의 자식파일 길이 점검
 *        - newParentDir 의 자식파일 순서 점검(OID 체크)
 *     2. extraFileRows 점검
 *        - 길이 점검
 *        - oldParentDir 의 자식파일 순서 점검(OID 체크)
 *        - newParentDir 의 자식파일 순서 점검(OID 체크)
 */

export async function _3_1_FrontToMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 3-1. 맨앞 -> 가운데
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 1234056789
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_0']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_0'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-1. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-1. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-1. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-1. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-1. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-1. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-1. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-1. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_2_MiddleToFront(db: mysql.Pool, logLevel: number) {
  /**
   * 3-2. 가운데 -> 맨앞
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 4012356789
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_4']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_4'],
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-2. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-2. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-2. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-2. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-2. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-2. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-2. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-2. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-2. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_3_FrontToBack(db: mysql.Pool, logLevel: number) {
  /**
   * 3-3. 맨앞 -> 맨뒤
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 1234567890
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_0']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9'],
      this.fileOIds['file0_0']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-3. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-3. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-3. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-3. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-3. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-3. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-3. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-3. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-3. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_4_BackToFront(db: mysql.Pool, logLevel: number) {
  /**
   * 3-4. 맨뒤 -> 맨앞
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 9012345678
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_9']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_9'],
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-4. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-4. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-4. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-4. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-4. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-4. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-4. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-4. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-4. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_5_MiddleToMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 3-5. 가운데 -> 가운데
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 0123564789
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_4']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-5. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-5. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-5. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-5. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-5. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-5. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-5. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-5. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-5. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_6_MiddleToBack(db: mysql.Pool, logLevel: number) {
  /**
   * 3-6. 가운데 -> 맨뒤
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 0123467895
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_5']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9'],
      this.fileOIds['file0_5']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-6. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-6. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-6. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-6. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-6. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-6. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-6. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-6. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-6. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_7_BackToMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 3-7. 맨뒤 -> 가운데
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 0123495678
   * 로 변경한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_9']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_9'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-7. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-7. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-7. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-7. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-7. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-7. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-7. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-7. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-7. extraFileRows 가 들어오지 않았다.`
    }

    const revertParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: revertParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr: revertParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _3_8_BackToBack(db: mysql.Pool, logLevel: number) {
  /**
   * 3-8. 맨뒤 -> 맨뒤
   *
   * dir0 의 자식파일 배열을
   *   0123456789 -> 0123456789
   * 로 유지한다.
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_9']
    const parentDirOId = this.dirOIds['dir0']
    const newParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 1) {
        throw `3-8. extraDirs 길이가 1이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== parentDirOId) {
        throw `3-8. 배열의 0번째 원소가 ${parentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const parentDir = extraDirs.directories[parentDirOId]
      if (!parentDir) {
        throw `3-8. parentDir 이 들어오지 않았다.`
      }

      if (parentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-8. parentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${parentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (parentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-8. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${parentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-8. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      if (extraFileRows.fileOIdsArr.length !== newParentChildArr.length) {
        throw `3-8. extraFileRows 길이가 ${newParentChildArr.length}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (extraFileRows.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `3-8. parentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `3-8. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: parentDirOId,
      oldParentChildArr: newParentChildArr,
      newParentDirOId: parentDirOId,
      newParentChildArr
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}
