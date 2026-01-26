import {Injectable, OnApplicationBootstrap} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {FILE_NORMAL, FILE_NOTICE} from '@secret'
import {generateObjectId} from '@util'

import * as ST from '@shareType'
import * as SV from '@shareValue'
import * as T from '@type'
import * as DTO from '@dto'

@Injectable()
export class DirectoryFileDBService implements OnApplicationBootstrap {
  private readonly NUM_FILE = 10

  private recentFileArr: ST.FileRowType[] = []
  private directoryMap: Map<string, ST.DirectoryType> = new Map()
  private fileRowMap: Map<string, ST.FileRowType> = new Map()

  async onApplicationBootstrap() {
    /**
     * onApplicationBootstrap
     *
     * 기능
     *   1. 최근 파일 목록 초기화(for 홈 탭)
     */
    try {
      await this._bootStrap_initRecentFileArr()
      // ::
    } catch (errObj) {
      // ::
    } finally {
      // ::
    }
  }

  constructor(private readonly dbService: DBService) {}

  // AREA1: Directory Area

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
            gkdErrCode: 'DIRECTORYFILEDB_createDir_InvalidParentDirOId',
            gkdErrMsg: `존재하지 않는 디렉토리`,
            gkdStatus: {dirName, parentDirOId},
            statusCode: 400,
            where,
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
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

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
        SELECT dirOId, fileOId, fileName, fileStatus, fileIdx, createdAt, updatedAt
        FROM files
        WHERE dirOId IN (${dirOIds.map(() => '?').join(',')})
        ORDER BY fileIdx
      `
      const paramFiles = [...dirOIds]
      const [files] = await connection.execute(queryFiles, paramFiles)
      const fileArr = files as RowDataPacket[]

      // 3. dirOId 별로 파일정보 그룹핑
      const fileMap = new Map<string, ST.FileRowType[]>()
      fileArr.forEach(row => {
        const {dirOId, fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {dirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
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
      const directoryArr: ST.DirectoryType[] = []
      const fileRowArr: ST.FileRowType[] = []

      dirArr.forEach(d => {
        const {dirOId, dirName, parentDirOId} = d
        const fileRows = fileMap.get(dirOId) || []
        const fileOIdsArr = fileRows.map(f => f.fileOId)
        fileRowArr.push(...fileRows)

        const subDirOIdsArr = subDirMap.get(dirOId) || []

        const directory: ST.DirectoryType = {
          dirName,
          dirOId,
          parentDirOId,
          fileOIdsArr,
          subDirOIdsArr,
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
        return {directory: null, fileRowArr: []}
      }

      const {dirName, parentDirOId} = resultArr[0]

      // 2-1. 자식 파일들 조회 뙇!!
      const queryFile = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await connection.execute(queryFile, [dirOId])

      const resultArrFile = resultFile as RowDataPacket[]

      // 2-2. 자식 파일들 OID 배열 뙇!!
      const fileOIdsArr: string[] = resultArrFile.map(row => row.fileOId)

      // 2-3. 자식 파일들의 행 배열 뙇!!
      const fileRowArr: ST.FileRowType[] = resultArrFile.map(row => {
        const {fileName, fileOId, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {
          dirOId,
          fileName,
          fileOId,
          fileStatus,
          createdAt,
          updatedAt,
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
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

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
      const queryFile = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const [resultFile] = await connection.execute(queryFile, [dirOId])
      const resultArrFile = resultFile as RowDataPacket[]

      // 2. 자식 파일들의 OId 배열 및 행 배열 생성
      const fileOIdsArr: string[] = []
      const fileRowArr: ST.FileRowType[] = []

      resultArrFile.forEach(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {dirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
        fileRowArr.push(fileRow)
        fileOIdsArr.push(fileOId)
      })

      // 3. 루트 폴더의 자식 폴더들 조회 뙇!!
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const [resultSubDir] = await connection.execute(querySubDir, [dirOId])
      const resultArrSubDir = resultSubDir as RowDataPacket[]
      const subDirOIdsArr: string[] = resultArrSubDir.map(row => row.dirOId)

      // 3. 디렉토리 타입으로 변환 및 리턴
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

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
      const query7 = `SELECT dirOId, fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId IN (?, ${subDirOIdsArr.map(() => '?').join(',')}) ORDER BY FIELD(fileOId, ?, ${subDirOIdsArr.map(() => '?').join(',')}), fileIdx ASC`
      const param7 = [dirOId, ...subDirOIdsArr, dirOId, ...subDirOIdsArr]
      const [result7] = await connection.execute(query7, param7)

      const result5Arr = result5 as RowDataPacket[]
      const result7Arr = result7 as RowDataPacket[]

      // 6. 초기 디렉토리 배열 생성(자식 배열 미완성)
      const directoryArr: ST.DirectoryType[] = result5Arr.map(row => {
        const {dirOId, dirName, parentDirOId} = row
        const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}
        return directory
      })

      // 7. 파일행 배열 생성 및 자식파일 목록에 추가
      const fileRowArr: ST.FileRowType[] = result7Arr.map(row => {
        const {dirOId, fileOId, fileName, fileStatus, createdAt, updatedAt} = row

        const index = directoryArr.findIndex(d => d.dirOId === dirOId)
        if (index !== -1) {
          directoryArr[index].fileOIdsArr.push(fileOId)
        }

        const fileRow: ST.FileRowType = {dirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
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

      // 2. (쿼리) dirOId 디렉토리의 fileArrLen 을 subFileOIdsArr.length 로 바꾼다.
      const query2 = `UPDATE directories SET fileArrLen = ? WHERE dirOId = ?`
      const param2 = [subFileOIdsArr.length, dirOId]
      await connection.execute(query2, param2)
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

      // 3. (쿼리) dirOId 디렉토리의 정보를 읽는다.
      const queryRead = `SELECT * FROM directories WHERE dirOId = ?`
      const paramsRead = [dirOId]

      const [resultRead] = await connection.execute(queryRead, paramsRead)

      const resultArr = resultRead as RowDataPacket[]

      // 4. 존재하지 않는 디렉토리인 경우
      if (resultArr.length === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리`},
          gkdErrCode: 'DIRECTORYFILEDB_updateDirName_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId, dirName},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      // 5. (쿼리) dirOId 디렉토리의 자식 파일들의 정보를 읽는다.
      const queryFile = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const paramsFile = [dirOId]
      const [resultFile] = await connection.execute(queryFile, paramsFile)

      const resultFileArr = resultFile as RowDataPacket[]

      // 6. (쿼리) dirOId 디렉토리의 자식 폴더들의 정보를 읽는다.
      const queryDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const paramsDir = [dirOId]
      const [resultDir] = await connection.execute(queryDir, paramsDir)

      const resultDirArr = resultDir as RowDataPacket[]

      // 8. 파일행 배열 생성
      const fileRowArr: ST.FileRowType[] = resultFileArr.map(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {dirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
        return fileRow
      })

      // 9. 자식 목록 추가
      const fileOIdsArr: string[] = resultFileArr.map(row => row.fileOId)
      const subDirOIdsArr: string[] = resultDirArr.map(row => row.dirOId)

      // 10. 디렉토리 정보 생성
      const {parentDirOId} = resultArr[0]
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr}

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
      const queryReadFile = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx`
      const paramReadFile = [dirOId]
      const [resultReadFile] = await connection.execute(queryReadFile, paramReadFile)

      const resultReadFileArr = resultReadFile as RowDataPacket[]

      // 4. 디렉토리 정보 생성
      const {dirName, parentDirOId} = resultMyArr[0]
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr: []}

      // 5. 파일행 배열 생성
      const fileRowArr: ST.FileRowType[] = resultReadFileArr.map(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {dirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
        directory.fileOIdsArr.push(fileOId)
        return fileRow
      })

      const directoryArr: ST.DirectoryType[] = [directory]

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
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr}

      const directoryArr: ST.DirectoryType[] = [directory]

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

      if (resultReadArr.length === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리 ${dirOId}`},
          gkdErrCode: 'DIRECTORYFILEDB_deleteDir_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {dirName, dirOId: _pDirOId, parentDirOId} = resultReadArr[0]

      // 2. (쿼리) 부모의 자식 폴더들 OId 조회
      const queryReadSubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx`
      const paramReadSubDir = [_pDirOId]
      const [resultReadSubDir] = await connection.execute(queryReadSubDir, paramReadSubDir)
      const resultReadSubDirArr = resultReadSubDir as RowDataPacket[]

      // 3. (쿼리) 부모의 자식 파일들 행 정보 조회
      const queryReadFile = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx`
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

      const directory: ST.DirectoryType = {dirOId: _pDirOId, dirName, parentDirOId, fileOIdsArr: [], subDirOIdsArr}

      const fileRowArr: ST.FileRowType[] = resultReadFileArr.map(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {dirOId: _pDirOId, fileName, fileOId, fileStatus, createdAt, updatedAt}
        directory.fileOIdsArr.push(fileOId)
        return fileRow
      })

      const directoryArr: ST.DirectoryType[] = [directory]

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

  // AREA2: File Area

  async createFile(where: string, dto: DTO.CreateFileDTO) {
    where = where + '/createFile'
    const {dirOId, fileName, userName, userOId} = dto

    /**
     * dirOId 에 fileName 이름의 파일 추가
     *
     * 1. fileOId 생성 (미중복 나올때까지 반복)
     * 2. 부모 디렉토리의 파일 갯수 받아오기
     * 3. 부모 디렉토리의 파일 갯수 증가
     * 4. 파일 추가
     * 5. 파일 타입으로 변환 및 리턴
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. fileOId 생성 (미중복 나올때까지 반복)
      let fileOId = generateObjectId()
      try {
        while (true) {
          const query = `SELECT fileOId FROM files WHERE fileOId = ?`
          const [result] = await connection.execute(query, [fileOId])
          const resultArr = result as RowDataPacket[]

          if (resultArr.length === 0) break

          fileOId = generateObjectId()
        }
        // ::
      } catch (errObj) {
        // ::
        throw errObj
      }

      let fileIdx = 0

      // 2. 부모 디렉토리의 파일 갯수 받아오기
      const queryLen = `SELECT fileArrLen FROM directories WHERE dirOId = ?`
      const [result] = await connection.execute(queryLen, [dirOId])

      const resultArr = result as RowDataPacket[]

      // 2-1. 부모 디렉토리 존재 체크
      if (resultArr.length === 0) {
        throw {
          gkd: {dirOId: `존재하지 않는 디렉토리`},
          gkdErrCode: 'DIRECTORYFILEDB_createFile_InvalidDirOId',
          gkdErrMsg: `존재하지 않는 디렉토리`,
          gkdStatus: {dirOId, fileName},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {fileArrLen} = resultArr[0]

      fileIdx = fileArrLen

      // 3. 부모 디렉토리의 파일 갯수 증가
      const queryUpdate = `UPDATE directories SET fileArrLen = fileArrLen + 1 WHERE dirOId = ?`
      const paramsUpdate = [dirOId]
      await connection.execute(queryUpdate, paramsUpdate)

      // 4. 파일 추가
      const query = `INSERT INTO files (content, fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      const params = ['', fileOId, fileName, dirOId, fileIdx, 0, userName, userOId]
      await connection.execute(query, params)

      // 5. 파일 타입으로 변환 및 리턴
      const createdAt = new Date()
      const updatedAt = new Date()
      const file: ST.FileType = {
        fileOId,
        fileName,
        dirOId,
        fileIdx,
        fileStatus: 0,
        userName,
        userOId,
        content: '',
        createdAt,
        updatedAt,
      }

      // 6. recentFileArr에 추가
      const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus: 0, createdAt, updatedAt}
      this._addToRecentFileArr(fileRow)

      return {file}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `파일 이름이 겹침`, message: errObj.message},
            gkdErrCode: 'DIRECTORYFILEDB_createFile_DuplicateFileName',
            gkdErrMsg: `파일 이름이 겹침`,
            gkdStatus: {dirOId, fileName},
            statusCode: 400,
            where,
          } as T.ErrorObjType
        }
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }

  async readFileByFileOId(where: string, fileOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM files WHERE fileOId = ?`
      const [result] = await connection.execute(query, [fileOId])

      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {file: null}
      }

      const {createdAt, dirOId, fileName, fileIdx, fileStatus, updatedAt, userName, userOId, content} = resultArr[0]

      const file: ST.FileType = {fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId, content, createdAt, updatedAt}

      return {file}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
      // ::
    }
  }
  async readFileNotice(where: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM files WHERE fileStatus = ?`
      const param = [FILE_NOTICE]
      const [result] = await connection.execute(query, param)
      const resultArr = result as RowDataPacket[]

      if (resultArr.length === 0) {
        return {file: null}
      }

      const {fileOId, fileName, dirOId, fileIdx, fileStatus, updatedAt, userName, userOId, content, createdAt} = resultArr[0]

      const file: ST.FileType = {fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId, content, createdAt, updatedAt}

      return {file}
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
  async readFileRowArrByRecent(where: string) {
    /**
     * 최근 게시물 목록 조회
     *
     * 1. 최근 게시물 목록 조회
     * 2. 리턴
     *
     * ------
     *
     * 리턴
     *
     *  - fileRowArr: 최근 게시물 행 배열
     */
    try {
      const fileRowArr = this.recentFileArr
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readFileRowArrByDirOId(where: string, dirOId: string) {
    const connection = await this.dbService.getConnection()

    try {
      const query = `SELECT * FROM files WHERE dirOId = ?`
      const [result] = await connection.execute(query, [dirOId])

      const resultArr = result as RowDataPacket[]

      resultArr.sort((a, b) => a.fileIdx - b.fileIdx)

      const fileRowArr: ST.FileRowType[] = resultArr.map(row => {
        const {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt} = row

        const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

        return fileRow
      })

      return {fileRowArr}
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

  async updateFileName(where: string, fileOId: string, fileName: string) {
    where = where + '/updateFileName'

    const connection = await this.dbService.getConnection()
    try {
      const queryUpdate = `UPDATE files SET fileName = ? WHERE fileOId = ?`
      const paramsUpdate = [fileName, fileOId]
      const [resultUpdate] = await connection.execute(queryUpdate, paramsUpdate)

      const queryRead = `SELECT * FROM files WHERE fileOId = ?`
      const [resultRead] = await connection.execute(queryRead, [fileOId])

      const resultArr = resultRead as RowDataPacket[]

      if (resultArr.length === 0) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'DIRECTORYFILEDB_updateFileName_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId, fileName},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {dirOId, fileStatus, createdAt, updatedAt} = resultArr[0]

      const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

      // 3. recentFileArr에 추가
      this._addToRecentFileArr(fileRow)

      return {directoryArr: [], fileRowArr: [fileRow]}
      // ::
    } catch (errObj) {
      // ::
      if (!errObj.gkd) {
        if (errObj.errno === 1062) {
          throw {
            gkd: {duplicate: `파일 이름이 겹침`, message: errObj.message},
            gkdErrCode: 'DIRECTORYFILEDB_updateFileName_DuplicateFileName',
            gkdErrMsg: `파일 이름이 겹침`,
            gkdStatus: {fileOId, fileName},
            statusCode: 400,
            where,
          } as T.ErrorObjType
        }
      }
      throw errObj
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
  async updateFileNameContent(where: string, fileOId: string, fileName: string, content: string) {
    where = where + '/updateFileNameContent'

    const connection = await this.dbService.getConnection()

    /**
     * fileOId 파일의 제목이나 내용을 수정한다.
     *
     * 1. 파일 업데이트
     * 2. 파일행을 위한 파일 조회
     * 3. 파일행 생성
     * 4. 리턴
     */
    try {
      // 1. 파일 업데이트
      const query = `UPDATE files SET fileName = ?, content = ? WHERE fileOId = ?`
      const params = [fileName, content, fileOId]
      await connection.execute(query, params)

      // 2. 파일행을 위한 파일 조회
      const queryRead = `SELECT dirOId, fileStatus, createdAt, updatedAt FROM files WHERE fileOId = ?`
      const paramsRead = [fileOId]
      const [resultRead] = await connection.execute(queryRead, paramsRead)

      const resultArr = resultRead as RowDataPacket[]

      if (resultArr.length === 0) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'DIRECTORYFILEDB_updateFileNameContent_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {dirOId, fileStatus, createdAt, updatedAt} = resultArr[0]

      const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

      // 3. recentFileArr에 추가
      this._addToRecentFileArr(fileRow)

      return {directoryArr: [], fileRowArr: [fileRow]}
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
  async updateFileStatus(where: string, fileOId: string, fileStatus: number) {
    where = where + '/updateFileStatus'
    const connection = await this.dbService.getConnection()

    /**
     * fileOId 파일의 fileStatus 데이터를 fileStatus 로 수정한다.
     */
    try {
      if (fileStatus === FILE_NOTICE) {
        const query = `UPDATE files SET fileStatus = ? WHERE fileStatus = ?`
        const param = [FILE_NORMAL, FILE_NOTICE]
        await connection.execute(query, param)
      }

      const query = `UPDATE files SET fileStatus = ? WHERE fileOId = ?`
      const params = [fileStatus, fileOId]
      await connection.execute(query, params)
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

  async deleteFile(where: string, fileOId: string) {
    where = where + '/deleteFile'

    /**
     * fileOId 파일을 삭제한다.
     *
     * 1. 파일 조회
     * 2. (쿼리) 파일 삭제
     * 3. (쿼리) 부모 폴더의 파일 갯수 감소
     * 4. 삭제 및 업데이트 쿼리 실행
     * 5. (쿼리) 부모 폴더 조회
     * 6. (쿼리) 부모 폴더의 자식 폴더들 조회
     * 7. (쿼리) 부모 폴더의 자식 파일들 조회
     * 8. 조회 쿼리 실행
     * 9. 부모 폴더와 자식파일행 정보 생성
     * 10. 리턴
     *
     * ------
     *
     * 리턴
     *
     *  - directoryArr: 삭제된 파일의 부모폴더 정보
     *  - fileRowArr: 부모폴더의 자식파일행 배열 정보
     */
    const connection = await this.dbService.getConnection()

    try {
      // 1. 파일 조회
      const queryRead = `SELECT * FROM files WHERE fileOId = ?`
      const [resultRead] = await connection.execute(queryRead, [fileOId])

      const resultArr = resultRead as RowDataPacket[]

      if (resultArr.length === 0) {
        throw {
          gkd: {fileOId: `존재하지 않는 파일`},
          gkdErrCode: 'DIRECTORYFILEDB_deleteFile_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }
      const {dirOId} = resultArr[0]

      // 2. (쿼리) 파일 삭제
      const queryDelete = `DELETE FROM files WHERE fileOId = ?`
      const paramsDelete = [fileOId]
      await connection.execute(queryDelete, paramsDelete)

      // 3. (쿼리) 부모 폴더의 파일 갯수 감소
      const queryUpdate = `UPDATE directories SET fileArrLen = fileArrLen - 1 WHERE dirOId = ?`
      const paramsUpdate = [dirOId]
      await connection.execute(queryUpdate, paramsUpdate)

      // 5. (쿼리) 부모 폴더 조회
      const queryReadDir = `SELECT * FROM directories WHERE dirOId = ?`
      const paramsReadDir = [dirOId]
      const [resultReadDir] = await connection.execute(queryReadDir, paramsReadDir)

      // 6. (쿼리) 부모 폴더의 자식 폴더들 조회
      const queryReadDirArr = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx ASC`
      const paramsReadDirArr = [dirOId]
      const [resultReadDirArr] = await connection.execute(queryReadDirArr, paramsReadDirArr)

      // 7. (쿼리) 부모 폴더의 자식 파일들 조회
      const queryReadFileArr = `SELECT fileOId, fileName, fileStatus, createdAt, updatedAt FROM files WHERE dirOId = ? ORDER BY fileIdx ASC`
      const paramsReadFileArr = [dirOId]
      const [resultReadFileArr] = await connection.execute(queryReadFileArr, paramsReadFileArr)

      // 8. 조회 쿼리 실행
      const {dirName, parentDirOId} = resultReadDir[0]

      const dirArr = resultReadDirArr as RowDataPacket[]
      const fileArr = resultReadFileArr as RowDataPacket[]

      // 9. 부모 폴더와 자식파일행 정보 생성
      const subDirOIdsArr = dirArr.map(row => row.dirOId)
      const fileOIdsArr = fileArr.map(row => row.fileOId)

      const directory: ST.DirectoryType = {
        dirName,
        dirOId,
        fileOIdsArr,
        parentDirOId,
        subDirOIdsArr,
      }

      const fileRowArr: ST.FileRowType[] = fileArr.map(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
        return fileRow
      })

      return {directoryArr: [directory], fileRowArr}
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

  // AREA3: Private Area

  /**
   * recentFileArr에 파일 추가
   * - 생성된지 72시간이 지나지 않은 것만 추가
   * - 최대 NUM_FILE(10)개까지만 유지
   * - updatedAt DESC 순서로 정렬
   */
  private _addToRecentFileArr(fileRow: ST.FileRowType) {
    const now = new Date()
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000)
    const createdAt = new Date(fileRow.createdAt)

    // 생성된지 72시간이 지나지 않은 것만 추가
    if (createdAt < seventyTwoHoursAgo) {
      return
    }

    // 숨김 파일은 제외
    if (fileRow.fileStatus === SV.FILE_HIDDEN) {
      return
    }

    // 기존에 같은 fileOId가 있으면 제거
    this.recentFileArr = this.recentFileArr.filter(item => item.fileOId !== fileRow.fileOId)

    // 배열에 추가
    this.recentFileArr.push(fileRow)

    // updatedAt DESC로 정렬
    this.recentFileArr.sort((a, b) => {
      const aUpdatedAt = new Date(a.updatedAt).getTime()
      const bUpdatedAt = new Date(b.updatedAt).getTime()
      return bUpdatedAt - aUpdatedAt
    })

    // 최대 NUM_FILE(10)개까지만 유지
    if (this.recentFileArr.length > this.NUM_FILE) {
      this.recentFileArr = this.recentFileArr.slice(0, this.NUM_FILE)
    }
  }

  private async _bootStrap_initRecentFileArr() {
    /**
     * _bootStrap_initRecentFileArr
     *
     * 기능
     *   1. 최근 파일 목록 초기화(for 홈 탭)
     *     - 수정된지 3일이 지나지 않은 파일만 조회 (숨김 파일 제외)
     */
    const connection = await this.dbService.getConnection()
    try {
      // 1. 수정된지 3일이 지나지 않은 파일만 조회 (숨김 파일 제외)
      const now = new Date()
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

      const query = `SELECT * FROM files WHERE fileStatus != ? AND updatedAt >= ? ORDER BY updatedAt DESC`
      const params = [SV.FILE_HIDDEN, threeDaysAgo]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      this.recentFileArr = resultArr.map(file => {
        const {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt} = file
        const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
        return fileRow
      })
      // ::
    } catch (errObj) {
      // ::
      // 초기화 실패 시 빈 배열로 유지
      console.log(`[DirectoryFileDBService(Bootstrap)] 최근 게시물 목록 초기화 실패`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`   ${key}: ${errObj[key]}`)
      })
      this.recentFileArr = []
      // ::
    } finally {
      // ::
      connection.release()
    }
  }
}
