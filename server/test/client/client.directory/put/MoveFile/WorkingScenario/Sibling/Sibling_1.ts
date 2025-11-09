import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

/**
 * MoveFile 함수의 WorkingScenario 테스트중 일부
 *   2. 형제간의 이동 (1~6/12)
 *     2-1. 맨앞 -> 0번째 인덱스
 *     2-2. 맨앞 -> null 인덱스
 *     2-3. 맨앞 -> 가운데
 *     2-4. 가운데 -> 맨앞
 *     2-5. 맨앞 -> 맨뒤
 *     2-6. 맨뒤 -> 맨앞
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

export async function _2_1_Dir0FrontToDir1Idx0(db: mysql.Pool, logLevel: number) {
  /**
   * 2-1. dir0 맨앞 -> dir1 0번째 인덱스
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_0']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
    const oldParentChildArr = [
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
    const newParentChildArr = [
      this.fileOIds['file0_0'],
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file1_5'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8'],
      this.fileOIds['file1_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-1. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-1. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-1. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-1. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-1. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-1. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-1. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-1. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-1. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-1. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-1. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-1. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-1. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-1. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
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
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _2_2_Dir1FrontToDir0IdxNull(db: mysql.Pool, logLevel: number) {
  /**
   * 2-2. dir1 맨앞 -> dir0 null 인덱스
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file1_0']
    const oldParentDirOId = this.dirOIds['dir1']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file1_5'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8'],
      this.fileOIds['file1_9']
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
      this.fileOIds['file0_9'],
      this.fileOIds['file1_0']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-2. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-2. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-2. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-2. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-2. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-2. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-2. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-2. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-2. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-2. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-2. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-2. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-2. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
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
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ]
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _2_3_Dir0FrontToDir1Middle(db: mysql.Pool, logLevel: number) {
  /**
   * 2-3. dir0 맨앞 -> dir1 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_0']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
    const oldParentChildArr = [
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
    const newParentChildArr = [
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file0_0'],
      this.fileOIds['file1_5'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8'],
      this.fileOIds['file1_9']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-3. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-3. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-3. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-3. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-3. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-3. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-3. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-3. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-3. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-3. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-3. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-3. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-3. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
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
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _2_4_Dir1MiddleToDir0Front(db: mysql.Pool, logLevel: number) {
  /**
   * 2-4. dir1 가운데 -> dir0 맨앞
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file1_5']
    const oldParentDirOId = this.dirOIds['dir1']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8'],
      this.fileOIds['file1_9']
    ]
    const newParentChildArr = [
      this.fileOIds['file1_5'],
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

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-4. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-4. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-4. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-4. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-4. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-4. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-4. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-4. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-4. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-4. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-4. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-4. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-4. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-4. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
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
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ]
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _2_5_Dir0FrontToDir1Back(db: mysql.Pool, logLevel: number) {
  /**
   * 2-5. dir0 맨앞 -> dir1 맨뒤
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_0']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
    const oldParentChildArr = [
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
    const newParentChildArr = [
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file1_5'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8'],
      this.fileOIds['file1_9'],
      this.fileOIds['file0_0']
    ]

    const data: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId,
      oldParentChildArr,
      newParentDirOId,
      newParentChildArr
    }
    const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-5. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-5. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-5. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-5. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-5. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-5. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-5. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-5. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-5. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-5. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-5. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-5. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-5. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
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
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}

export async function _2_6_Dir1BackToDir0Front(db: mysql.Pool, logLevel: number) {
  /**
   * 2-6. dir1 맨뒤 -> dir0 맨앞
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file1_9']
    const oldParentDirOId = this.dirOIds['dir1']
    const newParentDirOId = this.dirOIds['dir0']
    const oldParentChildArr = [
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file1_5'],
      this.fileOIds['file1_6'],
      this.fileOIds['file1_7'],
      this.fileOIds['file1_8']
    ]
    const newParentChildArr = [
      this.fileOIds['file1_9'],
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

    if (extraDirs) {
      if (extraDirs.dirOIdsArr.length !== 2) {
        throw `2-6. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-6. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-6. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-6. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-6. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-6. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-6. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-6. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-6. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-6. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-6. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-6. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-6. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-6. extraFileRows 가 들어오지 않았다.`
    }

    const revertData: HTTP.MoveFileType = {
      moveFileOId,
      oldParentDirOId: newParentDirOId,
      oldParentChildArr: [
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
      ],
      newParentDirOId: oldParentDirOId,
      newParentChildArr: [
        this.fileOIds['file1_0'],
        this.fileOIds['file1_1'],
        this.fileOIds['file1_2'],
        this.fileOIds['file1_3'],
        this.fileOIds['file1_4'],
        this.fileOIds['file1_5'],
        this.fileOIds['file1_6'],
        this.fileOIds['file1_7'],
        this.fileOIds['file1_8'],
        this.fileOIds['file1_9']
      ]
    }
    await this.portService.moveFile(jwtPayload, revertData)
  } catch (errObj) {
    throw errObj
  }
}
