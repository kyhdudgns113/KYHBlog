import {Injectable} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {DirectoryType} from '@shareType'
import {generateObjectId} from '@util'

import * as DTO from '@dto'
import * as T from '@type'

@Injectable()
export class DirectoryDBService {
  constructor(private readonly dbService: DBService) {}

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

      // 2. 부모 디렉토리의 자식 폴더 갯수 받아오기(루트 아닐때만)
      if (parentDirOId !== null) {
        const queryParent = `SELECT subDirArrLen FROM directories WHERE dirOId = ?`
        const paramsParent = [parentDirOId]
        const [resultParent] = await connection.execute(queryParent, paramsParent)

        const resultArrParent = resultParent as RowDataPacket[]

        // 2-1. 부모 디렉토리 존재 체크
        if (resultArrParent.length === 0) {
          throw {
            gkd: {parentDirOId: `존재하지 않는 디렉토리`},
            gkdErrCode: 'DIRECTORYDB_createDir_InvalidParentDirOId',
            gkdErrMsg: `존재하지 않는 디렉토리`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where
          } as T.ErrorObjType
        }

        const {subDirArrLen} = resultArrParent[0]

        dirIdx = subDirArrLen
      }

      // 3. 디렉토리 생성
      const query = `INSERT INTO directories (dirOId, dirName, dirIdx, parentDirOId) VALUES (?, ?, ?, ?)`
      const params = [dirOId, dirName, dirIdx, parentDirOId]
      await connection.execute(query, params)

      // 4. 부모 디렉토리의 subDirArrLen 증가
      if (parentDirOId !== null) {
        const queryParentUpdate = `UPDATE directories SET subDirArrLen = subDirArrLen + 1 WHERE dirOId = ?`
        const paramsParentUpdate = [parentDirOId]
        await connection.execute(queryParentUpdate, paramsParentUpdate)
      }

      // 5. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      return {directory}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `자식 폴더의 이름은 겹치면 안됨`, message: errObj.message},
            gkdErrCode: 'DIRECTORYDB_createDir_DuplicateDirName',
            gkdErrMsg: `자식 폴더의 이름은 겹치면 안됨`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where
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
    const connection = await this.dbService.getConnection()

    try {
      // 1. 자식 디렉토리들 정보 조회
      const queryDirs = `
        SELECT dirOId, dirName, parentDirOId, dirIdx
        FROM directories
        WHERE parentDirOId = ?
        ORDER BY dirIdx
      `
      const paramDirs = [parentDirOId]
      const [dirs] = await connection.execute(queryDirs, paramDirs)
      const dirArr = dirs as RowDataPacket[]

      if (dirArr.length === 0) return {directoryArr: [], fileRowArr: []}

      const dirOIds = dirArr.map(d => d.dirOId)

      // 2. 모든 자식 폴더들의 자식 파일들 조회
      const queryFiles = `
        SELECT dirOId, fileOId, fileName, fileStatus, fileIdx
        FROM files
        WHERE dirOId IN (${dirOIds.map(() => '?').join(',')})
        ORDER BY fileIdx
      `
      const paramFiles = [...dirOIds]
      const [files] = await connection.execute(queryFiles, paramFiles)
      const fileArr = files as RowDataPacket[]

      // 3. dirOId 별로 파일정보 그룹핑
      const fileMap = new Map<string, T.FileRowType[]>()
      fileArr.forEach(row => {
        const {dirOId, fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        if (!fileMap.has(dirOId)) fileMap.set(dirOId, [])
        fileMap.get(dirOId).push(fileRow)
      })

      // 4. 모든 자식 폴더들의 자식 폴더들 조회
      const querySubDirs = `
        SELECT parentDirOId, dirOId
        FROM directories
        WHERE parentDirOId IN (${dirOIds.map(() => '?').join(',')})
        ORDER BY dirIdx
      `
      const paramSubDirs = [...dirOIds]
      const [subDirs] = await connection.execute(querySubDirs, paramSubDirs)
      const subDirArr = subDirs as RowDataPacket[]

      // 5. dirOId 별로 자식 폴더들의 OId 그룹핑
      const subDirMap = new Map<string, string[]>()
      subDirArr.forEach(row => {
        if (!subDirMap.has(row.parentDirOId)) subDirMap.set(row.parentDirOId, [])
        subDirMap.get(row.parentDirOId).push(row.dirOId)
      })

      // 6. 리턴할 정보들 생성
      const directoryArr: DirectoryType[] = []
      const fileRowArr: T.FileRowType[] = []

      dirArr.forEach(d => {
        const {dirOId, dirName, parentDirOId} = d
        const fileRows = fileMap.get(dirOId) || []
        const fileOIdsArr = fileRows.map(f => f.fileOId)
        fileRowArr.push(...fileRows)

        const subDirOIdsArr = subDirMap.get(dirOId) || []

        const directory: DirectoryType = {
          dirName,
          dirOId,
          parentDirOId,
          fileOIdsArr,
          subDirOIdsArr
        }
        directoryArr.push(directory)
      })

      return {directoryArr, fileRowArr}
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
    const connection = await this.dbService.getConnection()

    try {
      // 1. 디렉토리 조회 뙇!!
      const query = `SELECT * FROM directories WHERE dirOId = ?`
      const [result] = await connection.execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null}
      }

      const {dirName, parentDirOId} = resultArr[0]

      // 2-1. 자식 파일들 조회 뙇!!
      const queryFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await connection.execute(queryFile, [dirOId])

      const resultArrFile = resultFile as RowDataPacket[]

      // 2-2. 자식 파일들 OID 배열 뙇!!
      const fileOIdsArr: string[] = resultArrFile.map(row => row.fileOId)

      // 2-3. 자식 파일들의 행 배열 뙇!!
      const fileRowArr: T.FileRowType[] = resultArrFile.map(row => {
        const {fileName, fileOId, fileStatus} = row
        const fileRow: T.FileRowType = {
          dirOId,
          fileName,
          fileOId,
          fileStatus
        }
        return fileRow
      })

      // 3-1. 자식 폴더들 조회 뙇!!
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const [resultSubDir] = await connection.execute(querySubDir, [dirOId])

      const resultArrSubDir = resultSubDir as RowDataPacket[]

      // 3-2. 자식 폴더들 OID 배열 뙇!!
      const subDirOIdsArr: string[] = resultArrSubDir.map(row => row.dirOId)

      // 4. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

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
  async readDirRoot(where: string) {
    /**
     * 루트 폴더의 정보와 자식파일들의 행정보 배열을 리턴한다.
     * - 어차피 fileOIdsArr 구할때 파일 조회하는 쿼리를 실행한다.
     * - 이왕 쿼리 실행하는거 파일행 배열 정보도 리턴한다.
     *
     */
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM directories WHERE dirName = 'root'`
      const [result] = await connection.execute(query)

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {directory: null, fileRowArr: []}
      }

      const {dirOId, dirName, parentDirOId} = resultArr[0]

      // 1. 루트 폴더의 자식 파일들 조회 뙇!!
      const queryFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await connection.execute(queryFile, [dirOId])
      const resultArrFile = resultFile as RowDataPacket[]

      // 2. 자식 파일들의 OId 배열 및 행 배열 생성
      const fileOIdsArr: string[] = []
      const fileRowArr: T.FileRowType[] = []

      resultArrFile.forEach(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        fileRowArr.push(fileRow)
        fileOIdsArr.push(fileOId)
      })

      // 3. 루트 폴더의 자식 폴더들 조회 뙇!!
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const [resultSubDir] = await connection.execute(querySubDir, [dirOId])
      const resultArrSubDir = resultSubDir as RowDataPacket[]
      const subDirOIdsArr: string[] = resultArrSubDir.map(row => row.dirOId)

      // 3. 디렉토리 타입으로 변환 및 리턴
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

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

      // 3. dirOId 디렉토리의 subDirArrLen 을 subDirOIdsArr.length 로 바꾼다.
      const query3 = `UPDATE directories SET subDirArrLen = ? WHERE dirOId = ?`
      const param3 = [subDirOIdsArr.length, dirOId]
      await connection.execute(query3, param3)
      // ::

      // 4. (쿼리) 본인과 자식 폴더들의 정보를 읽는 쿼리
      const query5 = `SELECT * FROM directories WHERE dirOId IN (?, ${subDirOIdsArr.map(() => '?').join(',')}) ORDER BY FIELD(dirOId, ?, ${subDirOIdsArr.map(() => '?').join(',')})`
      const param5 = [dirOId, ...subDirOIdsArr, dirOId, ...subDirOIdsArr]
      const [result5] = await connection.execute(query5, param5)

      // 5. (쿼리) 본인과 자식 폴더들의 파일 정보들 읽어오는 쿼리
      const query7 = `SELECT dirOId, fileOId, fileName, fileStatus FROM files WHERE dirOId IN (?, ${subDirOIdsArr.map(() => '?').join(',')}) ORDER BY FIELD(fileOId, ?, ${subDirOIdsArr.map(() => '?').join(',')}), fileIdx ASC`
      const param7 = [dirOId, ...subDirOIdsArr, dirOId, ...subDirOIdsArr]
      const [result7] = await connection.execute(query7, param7)

      const result5Arr = result5 as RowDataPacket[]
      const result7Arr = result7 as RowDataPacket[]

      // 6. 초기 디렉토리 배열 생성(자식 배열 미완성)
      const directoryArr: DirectoryType[] = result5Arr.map(row => {
        const {dirOId, dirName, parentDirOId} = row
        const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}
        return directory
      })

      // 7. 파일행 배열 생성 및 자식파일 목록에 추가
      const fileRowArr: T.FileRowType[] = result7Arr.map(row => {
        const {dirOId, fileOId, fileName, fileStatus} = row

        const index = directoryArr.findIndex(d => d.dirOId === dirOId)
        if (index !== -1) {
          directoryArr[index].fileOIdsArr.push(fileOId)
        }

        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        return fileRow
      })

      // 8. 폴더들의 자식 폴더들 목록 추가
      directoryArr[0].subDirOIdsArr = [...subDirOIdsArr] // dirOId 건 직접 넣어줘도 된다.

      // 9. (쿼리) 자식 폴더들의 자식 폴더들의 목록 가져오는 쿼리
      if (subDirOIdsArr.length > 0) {
        const query6 = `
        SELECT dirOId, parentDirOId 
          FROM directories 
          WHERE parentDirOId IN (${subDirOIdsArr.map(() => '?').join(',')}) 
          ORDER BY FIELD(parentDirOId, ${subDirOIdsArr.map(() => '?').join(',')}), dirIdx ASC
        `
        const param6 = [...subDirOIdsArr, ...subDirOIdsArr]
        const [result6] = await connection.execute(query6, param6)
        const result6Arr = (result6 ?? []) as RowDataPacket[]

        result6Arr.forEach(row => {
          const {dirOId, parentDirOId} = row
          const index = directoryArr.findIndex(d => d.dirOId === parentDirOId)
          if (index !== -1) {
            directoryArr[index].subDirOIdsArr.push(dirOId)
          }
        })
      }

      return {directoryArr, fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      if (errObj.errno === 1062) {
        throw {
          gkd: {subDirOIdsArr: `자식 폴더 이름 중복 있음`},
          gkdErrCode: 'DIRECTORYDB_updateDirArr_Dir_Duplicate',
          gkdErrMsg: `자식 폴더 이름 중복 있음`,
          gkdStatus: {subDirOIdsArr, dirOId},
          statusCode: 400,
          where
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
     *   3. 정보 수정 쿼리 실행
     *   4. (쿼리) 본인 정보를 읽는 쿼리
     *   5. (쿼리) 자식 파일들의 파일 정보들 읽어오는 쿼리
     *   6. (쿼리) 자식 폴더들의 dirOId 만 읽어오는 쿼리
     *   7. 정보 읽기 쿼리 실행
     *   8. 디렉토리 정보 생성
     *   9. 파일행 배열 생성
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

      // 2. (쿼리) dirOId 디렉토리의 fileArrLen 을 subFileOIdsArr.length 로 바꾼다.
      const query2 = `UPDATE directories SET fileArrLen = ? WHERE dirOId = ?`
      const param2 = [subFileOIdsArr.length, dirOId]
      await connection.execute(query2, param2)

      // 4. (쿼리) 본인 정보를 읽는 쿼리
      const query4 = `SELECT * FROM directories WHERE dirOId = ?`
      const param4 = [dirOId]
      const [result4] = await connection.execute(query4, param4)

      // 5. (쿼리) 자식 파일들의 파일 정보들 읽어오는 쿼리
      const query5 = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const param5 = [dirOId]
      const [result5] = await connection.execute(query5, param5)

      // 6. (쿼리) 자식 폴더들의 dirOId 만 읽어오는 쿼리
      const query6 = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const param6 = [dirOId]
      const [result6] = await connection.execute(query6, param6)

      const result4Arr = result4 as RowDataPacket[]
      const result5Arr = result5 as RowDataPacket[]
      const result6Arr = result6 as RowDataPacket[]

      // 8. 디렉토리 정보 생성
      const {dirName, parentDirOId} = result4Arr[0]
      const subDirOIdsArr: string[] = result6Arr.map(row => row.dirOId)
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: subFileOIdsArr, subDirOIdsArr}

      // 9. 파일행 배열 생성
      const fileRowArr: T.FileRowType[] = result5Arr.map(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        return fileRow
      })

      const directoryArr: DirectoryType[] = [directory]

      return {directoryArr, fileRowArr}
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

      // 3. (쿼리) dirOId 디렉토리의 정보를 읽는다.
      const queryRead = `SELECT * FROM directories WHERE dirOId = ?`
      const paramsRead = [dirOId]

      const [resultRead] = await connection.execute(queryRead, paramsRead)

      const resultArr = resultRead as RowDataPacket[]

      // 4. 존재하지 않는 디렉토리인 경우
      if (resultArr.length === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리`},
          gkdErrCode: 'DIRECTORYDB_updateDirName_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId, dirName},
          statusCode: 400,
          where
        } as T.ErrorObjType // ::
      }

      // 5. (쿼리) dirOId 디렉토리의 자식 파일들의 정보를 읽는다.
      const queryFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const paramsFile = [dirOId]
      const [resultFile] = await connection.execute(queryFile, paramsFile)

      const resultFileArr = resultFile as RowDataPacket[]

      // 6. (쿼리) dirOId 디렉토리의 자식 폴더들의 정보를 읽는다.
      const queryDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const paramsDir = [dirOId]
      const [resultDir] = await connection.execute(queryDir, paramsDir)

      const resultDirArr = resultDir as RowDataPacket[]

      // 8. 파일행 배열 생성
      const fileRowArr: T.FileRowType[] = resultFileArr.map(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        return fileRow
      })

      // 9. 자식 목록 추가
      const fileOIdsArr: string[] = resultFileArr.map(row => row.fileOId)
      const subDirOIdsArr: string[] = resultDirArr.map(row => row.dirOId)

      // 10. 디렉토리 정보 생성
      const {parentDirOId} = resultArr[0]
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

      return {directoryArr: [directory], fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      if (errObj.errno === 1062) {
        throw {
          gkd: {dirName: `디렉토리 이름이 겹침`},
          gkdErrCode: 'DIRECTORYDB_updateDirName_DuplicateDirName',
          gkdErrMsg: `디렉토리 이름이 겹침`,
          gkdStatus: {dirOId, dirName},
          statusCode: 400,
          where
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
    const connection = await this.dbService.getConnection()

    try {
      // 1. (쿼리) dirOId 디렉토리의 subDirArrLen 을 0 으로 바꾼다.
      const queryUpdate = `UPDATE directories SET subDirArrLen = 0 WHERE dirOId = ?`
      const paramUpdate = [dirOId]

      await connection.execute(queryUpdate, paramUpdate)

      // 2. (쿼리) 본인 디렉토리 조회
      const queryRead = `SELECT * FROM directories WHERE dirOId = ?`
      const paramRead = [dirOId]
      const [resultMy] = await connection.execute(queryRead, paramRead)

      const resultMyArr = resultMy as RowDataPacket[]

      // 3. (쿼리) 본인 디렉토리의 자식 파일행 정보 조회
      const queryReadFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const paramReadFile = [dirOId]
      const [resultReadFile] = await connection.execute(queryReadFile, paramReadFile)

      const resultReadFileArr = resultReadFile as RowDataPacket[]

      // 4. 디렉토리 정보 생성
      const {dirName, parentDirOId} = resultMyArr[0]
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      // 5. 파일행 배열 생성
      const fileRowArr: T.FileRowType[] = resultReadFileArr.map(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId, fileName, fileOId, fileStatus}
        directory.fileOIdsArr.push(fileOId)
        return fileRow
      })

      const directoryArr: DirectoryType[] = [directory]

      return {directoryArr, fileRowArr}
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

    const connection = await this.dbService.getConnection()

    try {
      // 1. (쿼리) dirOId 디렉토리의 fileArrLen 을 0 으로 바꾼다.
      const queryUpdate = `UPDATE directories SET fileArrLen = 0 WHERE dirOId = ?`
      const paramUpdate = [dirOId]

      await connection.execute(queryUpdate, paramUpdate)

      // 2. (쿼리) 본인 디렉토리 조회
      const queryRead = `SELECT * FROM directories WHERE dirOId = ?`
      const paramRead = [dirOId]
      const [resultMy] = await connection.execute(queryRead, paramRead)

      const resultMyArr = resultMy as RowDataPacket[]

      // 3. (쿼리) 본인 디렉토리의 자식 폴더들 조회
      const queryReadSubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const paramReadSubDir = [dirOId]
      const [resultReadSubDir] = await connection.execute(queryReadSubDir, paramReadSubDir)

      const resultReadSubDirArr = resultReadSubDir as RowDataPacket[]

      // 4. 디렉토리 정보 생성
      const subDirOIdsArr: string[] = resultReadSubDirArr.map(row => row.dirOId)

      const {dirName, parentDirOId} = resultMyArr[0]
      const directory: DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr}

      const directoryArr: DirectoryType[] = [directory]

      return {directoryArr, fileRowArr: []}
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

  async deleteDir(where: string, dirOId: string) {
    where = where + '/deleteDir'

    /**
     * 기능
     *   - dirOId 디렉토리를 삭제한다.
     *
     * 순서
     *   1. (쿼리) 부모 폴더 조회
     *   2. (쿼리) 부모의 자식 폴더들 OId 조회
     *   3. (쿼리) 부모의 자식 파일들 행 정보 조회
     *   4. (쿼리) dirOId 폴더 삭제
     *   5. (쿼리) 부모 폴더의 자식폴더 개수 감소
     *   6. 부모 디렉토리 정보 생성
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. (쿼리) 부모 폴더 조회
      const queryRead = `
      SELECT * FROM directories WHERE dirOId = (
        SELECT parentDirOId FROM directories WHERE dirOId = ?
      )
      `
      const paramRead = [dirOId]
      const [resultRead] = await connection.execute(queryRead, paramRead)
      const resultReadArr = resultRead as RowDataPacket[]
      const {dirName, dirOId: _pDirOId, parentDirOId} = resultReadArr[0]

      // 2. (쿼리) 부모의 자식 폴더들 OId 조회
      const queryReadSubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const paramReadSubDir = [_pDirOId]
      const [resultReadSubDir] = await connection.execute(queryReadSubDir, paramReadSubDir)
      const resultReadSubDirArr = resultReadSubDir as RowDataPacket[]

      // 3. (쿼리) 부모의 자식 파일들 행 정보 조회
      const queryReadFile = `SELECT fileOId, fileName, fileStatus FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const paramReadFile = [_pDirOId]
      const [resultReadFile] = await connection.execute(queryReadFile, paramReadFile)
      const resultReadFileArr = resultReadFile as RowDataPacket[]

      // 4. (쿼리) dirOId 폴더 삭제
      const queryDelete = `DELETE FROM directories WHERE dirOId = ?`
      const paramDelete = [dirOId]
      await connection.execute(queryDelete, paramDelete)

      // 5. (쿼리) 부모 폴더의 자식폴더 개수 감소
      const queryUpdate = `UPDATE directories SET subDirArrLen = subDirArrLen - 1 WHERE dirOId = ?`
      const paramUpdate = [_pDirOId]
      await connection.execute(queryUpdate, paramUpdate)

      // 6. 부모 디렉토리 정보 생성
      const subDirOIdsArr: string[] = resultReadSubDirArr.map(row => row.dirOId).filter(_dirOId => _dirOId !== dirOId)

      const directory: DirectoryType = {dirOId: _pDirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr}

      const fileRowArr: T.FileRowType[] = resultReadFileArr.map(row => {
        const {fileOId, fileName, fileStatus} = row
        const fileRow: T.FileRowType = {dirOId: _pDirOId, fileName, fileOId, fileStatus}
        directory.fileOIdsArr.push(fileOId)
        return fileRow
      })

      const directoryArr: DirectoryType[] = [directory]

      return {directoryArr, fileRowArr}
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
   *
   * @param baseDirOId 조상인지 볼 디렉토리의 OId
   * @param targetDirOId 자손인지 볼 디렉토리의 OId
   */
  async isAncestor(where: string, baseDirOId: string, targetDirOId: string) {
    where = where + '/isAncestor'

    const connection = await this.dbService.getConnection()

    try {
      const query = `
        WITH RECURSIVE ancestors AS (
          SELECT dirOId, parentDirOId
          FROM directories
          WHERE dirOId = ?

          UNION ALL

          SELECT d.dirOId, d.parentDirOId
          FROM directories d
          INNER JOIN ancestors a ON d.dirOId = a.parentDirOId
        )
        SELECT 1
        FROM ancestors
        WHERE parentDirOId = ?
        LIMIT 1;
      `

      const [rows] = await connection.execute(query, [targetDirOId, baseDirOId])

      // 결과가 있으면 true, 없으면 false
      return (rows as any[]).length > 0
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
}
