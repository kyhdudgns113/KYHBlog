import * as mysql from 'mysql2/promise'
import * as HTTP from '@httpDataType'
import {AUTH_ADMIN} from '@secret'

/**
 * MoveFile 함수의 WorkingScenario 테스트중 일부
 *   2. 형제간의 이동 (7~12/12)
 *     2-7. 가운데 -> 가운데
 *     2-8. 가운데 -> 가운데
 *     2-9. 가운데 -> 맨뒤
 *     2-10. 맨뒤 -> 가운데
 *     2-11. 맨뒤 -> 맨뒤
 *     2-12. 맨뒤 -> 맨뒤
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

export async function _2_7_Dir0MiddleToDir1Middle(db: mysql.Pool, logLevel: number) {
  /**
   * 2-7. dir0 가운데 -> dir1 가운데
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_5']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
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
      this.fileOIds['file1_0'],
      this.fileOIds['file1_1'],
      this.fileOIds['file1_2'],
      this.fileOIds['file1_3'],
      this.fileOIds['file1_4'],
      this.fileOIds['file0_5'],
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
        throw `2-7. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-7. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-7. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-7. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-7. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-7. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-7. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-7. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-7. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-7. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-7. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-7. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-7. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-7. extraFileRows 가 들어오지 않았다.`
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

export async function _2_8_Dir1MiddleToDir0Middle(db: mysql.Pool, logLevel: number) {
  /**
   * 2-8. dir1 가운데 -> dir0 가운데
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
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file1_5'],
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
        throw `2-8. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-8. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-8. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-8. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-8. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-8. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-8. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-8. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-8. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-8. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-8. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-8. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-8. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-8. extraFileRows 가 들어오지 않았다.`
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

export async function _2_9_Dir0MiddleToDir1Back(db: mysql.Pool, logLevel: number) {
  /**
   * 2-9. dir0 가운데 -> dir1 맨뒤
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_5']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
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
      this.fileOIds['file0_5']
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
        throw `2-9. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-9. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-9. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-9. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-9. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-9. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-9. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-9. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-9. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-9. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-9. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-9. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-9. extraFileRows 가 들어오지 않았다.`
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

export async function _2_10_Dir1BackToDir0Middle(db: mysql.Pool, logLevel: number) {
  /**
   * 2-10. dir1 맨뒤 -> dir0 가운데
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
      this.fileOIds['file0_0'],
      this.fileOIds['file0_1'],
      this.fileOIds['file0_2'],
      this.fileOIds['file0_3'],
      this.fileOIds['file0_4'],
      this.fileOIds['file1_9'],
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
        throw `2-10. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-10. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-10. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-10. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-10. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-10. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-10. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-10. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-10. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-10. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-10. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-10. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-10. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-10. extraFileRows 가 들어오지 않았다.`
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

export async function _2_11_Dir0BackToDir1Back(db: mysql.Pool, logLevel: number) {
  /**
   * 2-11. dir0 맨뒤 -> dir1 맨뒤
   */
  try {
    const {jwtPayload} = this.testDB.getJwtPayload(AUTH_ADMIN)
    const moveFileOId = this.fileOIds['file0_9']
    const oldParentDirOId = this.dirOIds['dir0']
    const newParentDirOId = this.dirOIds['dir1']
    const oldParentChildArr = [
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
        throw `2-11. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-11. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-11. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-11. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-11. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-11. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-11. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-11. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-11. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-11. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-11. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-11. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-11. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-11. extraFileRows 가 들어오지 않았다.`
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

export async function _2_12_Dir1BackToDir0Back(db: mysql.Pool, logLevel: number) {
  /**
   * 2-12. dir1 맨뒤 -> dir0 맨뒤
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
        throw `2-12. extraDirs 길이가 2이 아닌 ${extraDirs.dirOIdsArr.length} 이다.`
      }

      if (extraDirs.dirOIdsArr[0] !== oldParentDirOId) {
        throw `2-12. 배열의 0번째 원소가 ${oldParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[0]} 이다.`
      }

      const oldParentDir = extraDirs.directories[oldParentDirOId]
      if (!oldParentDir) {
        throw `2-12. oldParentDir 이 들어오지 않았다.`
      }

      if (oldParentDir.fileOIdsArr.length !== oldParentChildArr.length) {
        throw `2-12. oldParentDir 의 자식파일 길이가 ${oldParentChildArr.length}가 아닌 ${oldParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldParentChildArr.length; i++) {
        if (oldParentDir.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-12. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${oldParentDir.fileOIdsArr[i]} 이다.`
        }
      }

      if (extraDirs.dirOIdsArr[1] !== newParentDirOId) {
        throw `2-12. 배열의 1번째 원소가 ${newParentDirOId} 이 아닌 ${extraDirs.dirOIdsArr[1]} 이다.`
      }

      const newParentDir = extraDirs.directories[newParentDirOId]
      if (!newParentDir) {
        throw `2-12. newParentDir 이 들어오지 않았다.`
      }

      if (newParentDir.fileOIdsArr.length !== newParentChildArr.length) {
        throw `2-12. newParentDir 의 자식파일 길이가 ${newParentChildArr.length}가 아닌 ${newParentDir.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < newParentChildArr.length; i++) {
        if (newParentDir.fileOIdsArr[i] !== newParentChildArr[i]) {
          throw `2-12. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${newParentDir.fileOIdsArr[i]} 이다.`
        }
      }
    } else {
      throw `2-12. extraDirs 가 들어오지 않았다.`
    }

    if (extraFileRows) {
      const oldLen = oldParentChildArr.length
      const newLen = newParentChildArr.length

      if (extraFileRows.fileOIdsArr.length !== oldLen + newLen) {
        throw `2-12. extraFileRows 길이가 ${oldLen + newLen}이 아닌 ${extraFileRows.fileOIdsArr.length} 이다.`
      }

      for (let i = 0; i < oldLen; i++) {
        if (extraFileRows.fileOIdsArr[i] !== oldParentChildArr[i]) {
          throw `2-12. oldParentDir 의 ${i}번째 자식파일 OID 가 ${oldParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i]} 이다.`
        }
      }

      for (let i = 0; i < newLen; i++) {
        if (extraFileRows.fileOIdsArr[i + oldLen] !== newParentChildArr[i]) {
          throw `2-12. newParentDir 의 ${i}번째 자식파일 OID 가 ${newParentChildArr[i]} 이 아닌 ${extraFileRows.fileOIdsArr[i + oldLen]} 이다.`
        }
      }
    } else {
      throw `2-12. extraFileRows 가 들어오지 않았다.`
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


