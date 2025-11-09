import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

/**
 * MoveFile 함수의 WorkingScenario 테스트중 일부
 *   1. 부모자식간의 이동 (7~12/18)
 *     1-7. 자식 가운데 -> 부모 맨앞
 *     1-8. 부모 맨앞 -> 자식 가운데
 *     1-9. 자식 가운데 -> 부모 가운데
 *     1-10. 부모 가운데 -> 자식 가운데
 *     1-11. 자식 가운데 -> 부모 맨뒤
 *     1-12. 부모 맨뒤 -> 자식 가운데
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

export async function _1_7_SonMiddleToParentFront(db: mysql.Pool, logLevel: number) {
  /**
   * 1-7. 자식 가운데 -> 부모 맨앞
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_5']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]
    const newParentChildArr = [
      this.fileOIds['file0_5'],
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _1_8_ParentFrontToSonMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-8. 부모 맨앞 -> 자식 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_5']
    const oldParentDirOId = this.dirOIds['root']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9']
    ]
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
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _1_9_SonMiddleToParentMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-9. 자식 가운데 -> 부모 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_6']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_7'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]
    const newParentChildArr = [
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file0_6'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _1_10_ParentMiddleToSonMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-10. 부모 가운데 -> 자식 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_6']
    const oldParentDirOId = this.dirOIds['root']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9']
    ]
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
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _1_11_SonMiddleToParentBack(db: mysql.Pool, logLevel: number) {
  /**
   * 1-11. 자식 가운데 -> 부모 맨뒤
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_7']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['root']
    const oldParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file0_5'],
      this.fileOIds['file0_6'],
      this.fileOIds['file0_8'],
      this.fileOIds['file0_9']
    ]
    const newParentChildArr = [
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9'],
      this.fileOIds['file0_7']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}

export async function _1_12_ParentBackToSonMiddle(db: mysql.Pool, logLevel: number) {
  /**
   * 1-12. 부모 맨뒤 -> 자식 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_7']
    const oldParentDirOId = this.dirOIds['root']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file0'],
      this.fileOIds['file1'],
      this.fileOIds['file2'],
      this.fileOIds['file3'],
      this.fileOIds['file4'],
      this.fileOIds['file5'],
      this.fileOIds['file6'],
      this.fileOIds['file7'],
      this.fileOIds['file8'],
      this.fileOIds['file9']
    ]
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
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    // 코드 접기용
    if (extraDirs) {
      // 1-1. extraDirs 길이가 2인가?
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `1-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      // 1-2. extraDirs 의 0번째 dirOId 가 기존 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `1-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      // 1-3. oldParentDir 들어왔는지 체크
      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `1-3. oldParentDir 이 들어오지 않았다.`
      }

      // 1-4. oldParentDir 의 자식파일 길이 점검
      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `1-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-5. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `1-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      // 1-6. newParentDirOId 가 새로운 부모 디렉토리인가?
      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `1-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      // 1-7. newParentDir 들어왔는지 체크
      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `1-7. newParentDir 이 들어오지 않았다.`
      }

      // 1-8. newParentDir 의 자식파일 길이 점검
      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `1-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      // 1-9. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `1-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } // ::
    else {
      throw `1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      // 2-1. extraFileRows 길이가 20인가?
      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      // 2-2. oldParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      // 2-3. newParentDir 의 자식파일 순서 점검(OID 체크)
      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } // ::
    else {
      throw `2. extraFileRows 가 들어오지 않았다.`
    }

    // ::
  } catch (errObj) {
    // ::
    throw errObj
  }
}
