import {Injectable} from '@nestjs/common'
import {DBService} from '../__db'
import {CacheDBService} from '../_cacheDB'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as DTO from '@dto'
import * as ST from '@shareType'
import * as SV from '@shareValue'
import * as T from '@type'

@Injectable()
export class DirectoryDBService {
  constructor(
    private readonly cacheDBService: CacheDBService,
    private readonly dbService: DBService
  ) {}

  async createDir(where: string, dto: DTO.CreateDirDTO) {
    where = where + '/createDir'
    /**
     * 1. dirOId 생성 (미중복 나올때까지 반복)
     * 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
     * 3. 디렉토리 생성
     * 4. 부모 디렉토리의 subDirArrLen 증가
     * 5. 디렉토리 타입으로 변환 및 리턴
     */
    const {dirName, parentDirOId} = dto
    const connection = await this.dbService.getConnection()

    try {
      // 1. dirOId 생성 (미중복 나올때까지 반복)
      let dirOId = generateObjectId()
      try {
        while (true) {
          const query = `SELECT dirName FROM directories WHERE dirOId = ?`
          const [result] = await connection.execute(query, [dirOId])
          const resultArr = result as RowDataPacket[]
          if (resultArr.length === 0) break

          dirOId = generateObjectId()
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      let dirIdx = 0

      // 2. 메모리에서 부모 디렉토리의 자식 디렉토리 갯수 받아오기(루트 아닐때만)
      if (parentDirOId !== null) {
        const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(parentDirOId)

        if (parentDir) {
          dirIdx = parentDir.subDirOIdsArr.length
        } // ::
        else {
          throw {
            gkd: {parentDirOId: `존재하지 않는 디렉토리`},
            gkdErrCode: 'DIRECTORYFILEDB_createDir_InvalidParentDirOId',
            gkdErrMsg: `존재하지 않는 디렉토리`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where,
          } as T.ErrorObjType
        }
      }

      // 3. 디렉토리 생성
      const query = `INSERT INTO directories (dirOId, dirName, dirIdx, parentDirOId) VALUES (?, ?, ?, ?)`
      const params = [dirOId, dirName, dirIdx, parentDirOId]
      await connection.execute(query, params)

      // 4. 메모리에 있는 부모 디렉토리에 자식 디렉토리 추가
      if (parentDirOId !== null) {
        const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(parentDirOId)
        if (parentDir) {
          parentDir.subDirOIdsArr.push(dirOId)
        }
      }

      // 5. 디렉토리 타입으로 변환 및 리턴
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: [], updatedAtFile: null}
      this.cacheDBService.setDirectoryToMemory(directory)

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `자식 폴더의 이름은 겹치면 안됨`, message: errObj.message},
            gkdErrCode: 'DIRECTORYFILEDB_createDir_DuplicateDirName',
            gkdErrMsg: `자식 폴더의 이름은 겹치면 안됨`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where,
          } as T.ErrorObjType
        } // ::
        else {
          errObj.statusCode = 500
        }
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async createDirRoot(where: string) {
    where = where + '/createDirRoot'

    try {
      const dto: DTO.CreateDirDTO = {dirName: 'root', parentDirOId: null}
      const {directory} = await this.createDir(where, dto)
      // this.cacheDBService.setDirectoryToMemory(directory) // createDir 에서 이미 추가되었다.

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async readDirArrByParentDirOId(where: string, parentDirOId: string) {
    /**
     * parentDirOId 가 부모인 디렉토리들의 배열을 리턴한다.
     * - 정렬은 dirIdx 기준으로 한다.
     */
    try {
      // 1. 부모 디렉토리 정보를 캐시에서 가져오기
      const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(parentDirOId)
      if (!parentDir) {
        return {directoryArr: [], fileRowArr: []}
      }

      // 2. 자식 디렉토리들의 OId 배열 가져오기
      const subDirOIdsArr = parentDir.subDirOIdsArr
      if (subDirOIdsArr.length === 0) {
        return {directoryArr: [], fileRowArr: []}
      }

      // 3. 자식 디렉토리들 정보를 캐시에서 가져오기
      const {directoryArr} = await this.cacheDBService.getDirectoryByDirOIdArr(subDirOIdsArr)

      // 4. 자식 디렉토리들의 파일행 배열 가져오기
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr(subDirOIdsArr)

      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readDirByDirOId(where: string, dirOId: string) {
    /**
     * dirOId 에 해당하는 디렉토리를 정보를 리턴한다
     * 해당 디렉토리의 자식파일 행들의 배열도 리턴한다
     *   - fileOIdsArr 값 얻기 위해서라도 파일 조회하는 쿼리를 쓴다
     *   - 어차피 쿼리 쓸거라면 파일 행 정보도 구해줘서 리턴해주자
     *   - 역할이 하나 추가되서 좀 애매하긴 하다 ㅠㅠ
     *
     * 1. 디렉토리 조회 뙇!!
     * 2. 자식 파일들
     *   2-1. 자식 파일들 조회 뙇!!
     *   2-2. 자식 파일들 OID 배열 뙇!!
     *   2-3. 자식 파일들의 행 배열 뙇!!
     * 3. 자식 폴더들
     *   3-1. 자식 폴더들 조회 뙇!!
     *   3-2. 자식 폴더들 OID 배열 뙇!!
     * 4. 디렉토리 타입으로 변환 및 리턴
     */
    try {
      // 1. 디렉토리 정보를 캐시에서 가져오기
      const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)

      if (!directory) {
        return {directory: null, fileRowArr: []}
      }

      // 2. 자식 파일들의 행 배열을 캐시에서 가져오기
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])

      return {directory, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  async readDirRoot(where: string) {
    /**
     * 루트 폴더의 정보와 자식파일들의 행정보 배열을 리턴한다.
     * - 어차피 fileOIdsArr 구할때 파일 조회하는 쿼리를 실행한다.
     * - 이왕 쿼리 실행하는거 파일행 배열 정보도 리턴한다.
     *
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. 루트 디렉토리 OId 찾기
      const query = `SELECT dirOId FROM directories WHERE dirName = 'root'`
      const [result] = await connection.execute(query)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null, fileRowArr: []}
      }

      const {dirOId} = resultArr[0]

      // 2. 루트 디렉토리 정보를 캐시에서 가져오기
      const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)

      if (!directory) {
        return {directory: null, fileRowArr: []}
      }

      // 3. 루트 폴더의 자식 파일들의 행 배열을 캐시에서 가져오기
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])

      return {directory, fileRowArr}
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

  async updateDirArr_Dir(where: string, dirOId: string, subDirOIdsArr: string[]) {
    where = where + '/updateDirArr_Dir'

    /**
     * 기능
     *   - subDirOIdsArr 에 있는 디렉토리들의 dirIdx 를 배열 내의 인덱스로 바꾼다.
     *   - subDirOIdsArr 에 있는 디렉토리들의 parentDirOId 를 dirOId 로 바꾼다.
     *   - dirOId 디렉토리의 subDirArrLen 을 subDirOIdsArr.length 로 바꾼다.
     *
     * 순서
     *   1. (쿼리) 자식 폴더들의 dirIdx 를 배열 내의 인덱스로 바꾼다.
     *   2. (쿼리) 자식 폴더들의 parentDirOId 를 dirOId 로 바꾼다.
     *   3. (쿼리) dirOId 디렉토리의 subDirArrLen 을 subDirOIdsArr.length 로 바꾼다.
     *   4. (쿼리) 본인과 자식 폴더들의 정보를 읽는 쿼리
     *   5. (쿼리) 자식 폴더들의 자식 폴더들의 목록 가져오는 쿼리
     *   6. (쿼리) 본인과 자식 폴더들의 파일 정보들 읽어오는 쿼리
     *   7. 디렉토리 배열 생성
     *   8. 파일행 배열 생성 및 자식파일 목록에 추가
     *   9. 폴더들의 자식 폴더들 목록 추가
     */
    const connection = await this.dbService.getConnection()

    try {
      // CASE 1. 자식 폴더들이 없는 경우
      if (subDirOIdsArr.length === 0) {
        return this.updateDirResetArrLen_Dir(where, dirOId)
      }

      // 1. 자식 폴더들의 dirIdx 를 배열 내의 인덱스로 바꾼다.
      // 2. 자식 폴더들의 parentDirOId 를 dirOId 로 바꾼다.
      const cases = subDirOIdsArr.map((id, idx) => `WHEN ? THEN ?`).join(' ')
      const query12 = `
        UPDATE directories
        SET dirIdx = (
          CASE dirOId
            ${cases}
            ELSE dirIdx
          END
        ),
        parentDirOId = ?
        WHERE dirOId IN (${subDirOIdsArr.map(() => '?').join(',')})
      `
      const param12 = [...subDirOIdsArr.flatMap((id, idx) => [id, idx]), dirOId, ...subDirOIdsArr]
      await connection.execute(query12, param12)

      // 3. 메모리에 있는 부모폴더의 자식폴더 목록 갱신
      const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (parentDir) {
        parentDir.subDirOIdsArr = [...subDirOIdsArr]
      }

      // 3. 메모리에 있는 자식폴더들의 parentDirOId 갱신
      for (const dirOId of subDirOIdsArr) {
        const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
        if (directory) {
          directory.parentDirOId = dirOId
        }
      }

      // 4. 초기 디렉토리 배열 생성(자식 배열 미완성)
      const dirOIdArr_param = [dirOId, ...subDirOIdsArr]
      const {directoryArr} = await this.cacheDBService.getDirectoryByDirOIdArr(dirOIdArr_param)

      // 5. 파일행 배열 생성 및 자식파일 목록에 추가
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr(dirOIdArr_param)

      // 6. 리턴
      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      if (errObj.errno === 1062) {
        throw {
          gkd: {subDirOIdsArr: `자식 폴더 이름 중복 있음`},
          gkdErrCode: 'DIRECTORYFILEDB_updateDirArr_Dir_Duplicate',
          gkdErrMsg: `자식 폴더 이름 중복 있음`,
          gkdStatus: {subDirOIdsArr, dirOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateDirArr_File(where: string, dirOId: string, subFileOIdsArr: string[]) {
    where = where + '/updateDirArr_File'
    /**
     * 기능
     *   - subFileOIdsArr 에 있는 파일들의 dirIdx 를 배열 내의 인덱스로 바꾼다.
     *   - subFileOIdsArr 에 있는 파일들의 parentDirOId 를 dirOId 로 바꾼다.
     *   - dirOId 디렉토리의 fileArrLen 을 subFileOIdsArr.length 로 바꾼다.
     *
     * 순서
     *   1. (쿼리) 자식 파일들의 fileIdx 를 배열 내의 인덱스로 바꾼다.
     *   2. (쿼리) dirOId 디렉토리의 fileArrLen 을 subFileOIdsArr.length 로 바꾼다.
     */

    const connection = await this.dbService.getConnection()

    try {
      // CASE 1. 자식 파일들이 없는 경우
      if (subFileOIdsArr.length === 0) {
        return this.updateDirResetArrLen_File(where, dirOId)
      }

      // 1. (쿼리) 자식 파일들의 fileIdx 를 배열 내의 인덱스로 바꾼다.
      const cases = subFileOIdsArr.map((id, idx) => `WHEN ? THEN ?`).join(' ')
      const query1 = `
        UPDATE files
        SET fileIdx = (
          CASE fileOId
            ${cases}
            ELSE fileIdx
          END
        ),
        dirOId = ?
        WHERE fileOId IN (${subFileOIdsArr.map(() => '?').join(',')})
      `
      const param1 = [...subFileOIdsArr.flatMap((id, idx) => [id, idx]), dirOId, ...subFileOIdsArr]
      await connection.execute(query1, param1)

      // 2. 메모리에 있는 부모폴더의 파일 목록 갱신
      const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (parentDir) {
        parentDir.fileOIdsArr = [...subFileOIdsArr]
      }

      // 3. 메모리에 있는 자식파일들의 dirOId 갱신
      for (const fileOId of subFileOIdsArr) {
        const {fileRow} = await this.cacheDBService.getFileRowByFileOId(fileOId)
        if (fileRow) {
          fileRow.dirOId = dirOId
        }
      }
      // ::
    } catch (errObj) {
      // ::
      if (errObj.errno === 1062) {
        throw {
          gkd: {subFileOIdsArr: `자식 파일 이름 중복 있음`},
          gkdErrCode: 'DIRECTORYFILEDB_updateDirArr_File_Duplicate',
          gkdErrMsg: `자식 파일 이름 중복 있음`,
          gkdStatus: {subFileOIdsArr, dirOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateDirName(where: string, dirOId: string, dirName: string) {
    where = where + '/updateDirName'

    /**
     * 기능
     *   - dirOId 디렉토리의 dirName 을 dirName 으로 바꾼다.
     *
     * 순서
     *   1. (쿼리) dirOId 디렉토리의 dirName 을 dirName 으로 바꾼다.
     *   2. 업데이트 쿼리 실행
     *   3. (쿼리) dirOId 디렉토리의 정보를 읽는다.
     *   4. (쿼리) dirOId 디렉토리의 자식 파일들의 정보를 읽는다.
     *   5. (쿼리) dirOId 디렉토리의 자식 폴더들의 정보를 읽는다.
     *   6. 정보 읽기 쿼리 실행
     *   7. 디렉토리 정보 생성
     *   8. 파일행 배열 생성
     *   9. 자식 목록 추가
     *   10. 디렉토리 정보 생성
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. (쿼리) dirOId 디렉토리의 dirName 을 dirName 으로 바꾼다.
      const queryUpdate = `UPDATE directories SET dirName = ? WHERE dirOId = ?`
      const paramsUpdate = [dirName, dirOId]

      // 2. 업데이트 쿼리 실행
      await connection.execute(queryUpdate, paramsUpdate)

      // 2. 메모리에 있는 디렉토리의 dirName 갱신
      const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (directory) {
        directory.dirName = dirName
      }

      // 3. 메모리에 있는 디렉토리의 자식 파일행 목록 갱신
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])

      return {directoryArr: [directory], fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      if (errObj.errno === 1062) {
        throw {
          gkd: {dirName: `디렉토리 이름이 겹침`},
          gkdErrCode: 'DIRECTORYFILEDB_updateDirName_DuplicateDirName',
          gkdErrMsg: `디렉토리 이름이 겹침`,
          gkdStatus: {dirOId, dirName},
          statusCode: 400,
          where,
        } as T.ErrorObjType
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateDirResetArrLen_Dir(where: string, dirOId: string) {
    where = where + '/updateDirResetArrLen_Dir'

    /**
     * 기능
     *   - dirOId 디렉토리의 subDirArrLen 을 0 으로 바꾼다.
     *
     * 순서
     *   1. (쿼리) dirOId 디렉토리의 subDirArrLen 을 0 으로 바꾼다.
     *   2. (쿼리) 본인 디렉토리 조회
     *   3. (쿼리) 본인 디렉토리의 자식 파일행 정보 조회
     *   4. 디렉토리 정보 생성
     *   5. 파일행 배열 생성
     *
     * 리턴
     *   - directoryArr: 본인 디렉토리만 들어있는 배열
     *   - fileRowArr: 본인 디렉토리의 파일행 배열
     */

    const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
    if (directory) {
      directory.subDirOIdsArr = []
    }

    const directoryArr: ST.DirectoryType[] = [directory]
    const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])

    return {directoryArr, fileRowArr}
  }
  async updateDirResetArrLen_File(where: string, dirOId: string) {
    where = where + '/updateDirResetArrLen_File'

    /**
     * 기능
     *   - dirOId 디렉토리의 fileArrLen 을 0 으로 바꾼다.
     *
     * 순서
     *   1. (쿼리) dirOId 디렉토리의 fileArrLen 을 0 으로 바꾼다.
     *   2. (쿼리) 본인 디렉토리 조회
     *   3. (쿼리) 본인 디렉토리의 자식 폴더들 조회
     *   4. 디렉토리 정보 생성
     *
     * 리턴
     *   - directoryArr: 본인 디렉토리만 들어있는 배열
     */
    const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
    if (directory) {
      directory.fileOIdsArr = []
    }

    const directoryArr: ST.DirectoryType[] = [directory]

    return {directoryArr, fileRowArr: []}
  }

  async deleteDir(where: string, dirOId: string) {
    where = where + '/deleteDir'

    /**
     * 기능
     *   - dirOId 디렉토리를 삭제한다.
     *
     * 순서
     *   1. 메모리에 있는 부모폴더의 자식목록에서 본인 제거
     *   2. (쿼리) 디렉토리 삭제
     *   3. 메모리에서 디렉토리 삭제
     *   4. 부모 폴더의 자식 파일행 목록 메모리에서 불러오기
     *   5. 리턴
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. 메모리에 있는 부모폴더의 자식목록에서 본인 제거
      const {directory: dirDeleted} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (!dirDeleted) {
        return {directoryArr: [], fileRowArr: []}
      } // ::

      const parentDirOId = dirDeleted.parentDirOId

      // 2. (쿼리) dirOId 폴더 삭제
      const queryDelete = `DELETE FROM directories WHERE dirOId = ?`
      const paramDelete = [dirOId]
      await connection.execute(queryDelete, paramDelete)

      // 3. 메모리에서 디렉토리 삭제
      this.cacheDBService.removeDirectoryFromMemory(dirOId)

      const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(parentDirOId)
      if (!parentDir) {
        return {directoryArr: [], fileRowArr: []}
      }

      // 4. 부모 폴더의 자식 파일행 목록 메모리에서 불러오기
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([parentDirOId])

      return {directoryArr: [parentDir], fileRowArr}
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

  /**
   * isAncestor
   *   - baseDirOId 가 targetDirOId 의 조상인지 재귀적으로 확인한다.
   *   - 메모리(directoryMap)를 사용하여 확인한다.
   *
   * @param baseDirOId 조상인지 볼 디렉토리의 OId
   * @param targetDirOId 자손인지 볼 디렉토리의 OId
   */
  async isAncestor(where: string, baseDirOId: string, targetDirOId: string) {
    where = where + '/isAncestor'

    try {
      // targetDirOId부터 시작해서 부모 디렉토리를 따라 올라가면서 baseDirOId를 찾는다.
      let currentDirOId: string | null = targetDirOId

      while (currentDirOId) {
        const {directory: currentDir} = await this.cacheDBService.getDirectoryByDirOId(currentDirOId)
        if (!currentDir) {
          return false
        }

        // baseDirOId를 찾으면 true 반환
        if (currentDirOId === baseDirOId) {
          return true
        }

        // 부모 디렉토리로 이동
        currentDirOId = currentDir.parentDirOId
      }

      // 루트까지 올라갔는데 baseDirOId를 찾지 못했으면 false
      return false
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
}
