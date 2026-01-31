import {Injectable, OnApplicationBootstrap} from '@nestjs/common'
import {DBService} from '../__db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as ST from '@shareType'
import * as SV from '@shareValue'
import * as T from '@type'

@Injectable()
export class CacheDBService implements OnApplicationBootstrap {
  private directoryMap: Map<string, ST.DirectoryType> = new Map()
  private fileRowMap: Map<string, ST.FileRowType> = new Map()

  private recentFileArr: ST.FileRowType[] = []

  async onApplicationBootstrap() {
    /**
     * onApplicationBootstrap
     *
     * 기능
     *   1. 최근 파일 목록 초기화(for 홈 탭)
     *   2. 파일행 맵 초기화
     *   3. 디렉토리 맵 초기화
     */
    try {
      await this._bootstrap_initRecentFileArr()
      await this._bootstrap_initFileRowMap()
      await this._bootstrap_initDirectoryMap()
      // ::
    } catch (errObj) {
      // ::
    } finally {
      // ::
    }
  }

  constructor(private readonly dbService: DBService) {}

  // AREA1: Directory Area

  async getDirectoryByDirOId(dirOId: string, refreshDate: boolean = true) {
    // 1. 메모리에서 조회
    const directory = this.directoryMap.get(dirOId)
    if (directory) {
      return {directory}
    }

    // 2. 캐시미스: DB 에서 조회
    const connection = await this.dbService.getConnection()
    try {
      // 2-1. (쿼리) 현재 디렉토리 조회
      const query = `SELECT * FROM directories WHERE dirOId = ?`
      const params = [dirOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      // 2-2. DB 에 없으면 null 리턴한다.
      if (resultArr.length === 0) {
        return {directory: null}
      }

      // 2-3. 자식파일 및 자식폴더 정보 불러오기
      const {dirName, parentDirOId} = resultArr[0]

      const fileOIdsArr: string[] = [] // 나중에 업데이트
      const subDirOIdsArr: string[] = [] // 나중에 업데이트
      const updatedAtFile: Date | null = null // 나중에 업데이트

      // 2-3-1. (쿼리) 자식 파일들 불러오기
      const queryFile = `SELECT fileOId FROM files WHERE dirOId = ? ORDER BY fileIdx ASC`
      const paramsFile = [dirOId]
      const [resultFile] = await connection.execute(queryFile, paramsFile)
      const resultArrFile = resultFile as RowDataPacket[]

      // 2-3-2. DB 데이터를 이용해서 자식파일들 정보로 변환
      resultArrFile.forEach(row => {
        const {fileName, fileOId, fileStatus, createdAt, updatedAt} = row
        const fileRow: ST.FileRowType = {
          fileOId,
          fileName,
          dirOId,
          fileStatus,
          createdAt,
          updatedAt,
        }
        this.fileRowMap.set(fileOId, fileRow)
        fileOIdsArr.push(fileOId)
      })

      // 2-3-3. 자식 디렉토리들 불러오기
      const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx ASC`
      const paramsSubDir = [dirOId]
      const [resultSubDir] = await connection.execute(querySubDir, paramsSubDir)
      const resultArrSubDir = resultSubDir as RowDataPacket[]

      // 2-3-4. DB 데이터를 이용해서 자식디렉토리들 정보로 변환
      for (const row of resultArrSubDir) {
        const {dirOId: _dirOId} = row
        const {directory} = await this.getDirectoryByDirOId(_dirOId, false)

        if (directory) {
          // this.directoryMap.set(_dirOId, directory) // 본인 차례에서 이걸 이미 한다.
          subDirOIdsArr.push(_dirOId)
        } // ::
        else {
          // 자식폴더가 안들어오면 뭔가 잘못된거임.
          throw {
            gkd: {notFound: `자식 디렉토리를 찾을 수 없음`, message: `자식 디렉토리를 찾을 수 없음`},
            gkdErrCode: 'CACHEDB_getDirectoryByDirOId_NotFoundSubDir',
            gkdErrMsg: '자식 디렉토리를 찾을 수 없음',
            gkdStatus: {parentDirOId: dirOId, subDirOId: _dirOId},
            statusCode: 404,
            where: 'CacheDBService.getDirectoryByDirOId',
          } as T.ErrorObjType
        }
      }

      // 2-4. 디렉토리 타입으로 변환
      const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr, updatedAtFile}

      // 2-5. 메모리에 등록
      this.directoryMap.set(dirOId, directory)

      // 2-6. updatedAtFile 업데이트
      if (refreshDate) {
        // 재귀적으로 자손으로 내려가면서 업데이트를 한 뒤, 조상으로 거슬러 올라가는 함수이다.
        // 이걸 2-3-4 에서도 호출하면 안되기 때문에 refreshDate 파라미터를 추가했다.
        this._get_updatedAtFile_InMemory_recursively(dirOId)
      }

      return {directory}
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
  async getDirectoryByDirOIdArr(dirOIdsArr: string[]) {
    const directoryArr: ST.DirectoryType[] = []
    try {
      for (const dirOId of dirOIdsArr) {
        const {directory} = await this.getDirectoryByDirOId(dirOId)
        if (directory) {
          directoryArr.push(directory)
        }
      }
      return {directoryArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }

  removeDirectoryFromMemory(dirOId: string) {
    this.directoryMap.delete(dirOId)
  }

  setDirectoryToMemory(directory: ST.DirectoryType) {
    this.directoryMap.set(directory.dirOId, directory)
  }

  // AREA5: File Area

  addToRecentFileArr(fileRow: ST.FileRowType) {
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
  }

  changeAllFileStatusToNormal() {
    this.fileRowMap.forEach(fileRow => {
      fileRow.fileStatus = SV.FILE_NORMAL
    })
  }

  async getFileRowArrAll() {
    return {fileRowArr: Array.from(this.fileRowMap.values())}
  }
  async getFileRowByFileOId(fileOId: string) {
    // 1. 메모리에서 조회
    const fileRow = this.fileRowMap.get(fileOId)
    if (fileRow) {
      return {fileRow}
    } // ::
    // 2. 캐시미스: DB 에서 조회
    const connection = await this.dbService.getConnection()
    try {
      // 2-1. (쿼리) 현재 파일행 조회
      const query = `SELECT * FROM files WHERE fileOId = ?`
      const params = [fileOId]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      // 2-2. DB 에 없으면 null 리턴한다.
      if (resultArr.length === 0) {
        return {fileRow: null}
      }

      // 2-3. 파일행 타입으로 변환 및 메모리에 등록
      const {fileName, dirOId, fileStatus, createdAt, updatedAt} = resultArr[0]
      const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
      this.fileRowMap.set(fileOId, fileRow)

      // 2-4. 부모폴더의 updatedAtFile 업데이트
      this._get_updatedAtFile_InMemory_recursively(dirOId)

      return {fileRow}
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
  async getFileRowArrByDirOIdArr(dirOIdsArr: string[]) {
    const fileRowArr: ST.FileRowType[] = []

    try {
      for (const dirOId of dirOIdsArr) {
        const {directory} = await this.getDirectoryByDirOId(dirOId)
        if (directory) {
          for (const fileOId of directory.fileOIdsArr) {
            const {fileRow} = await this.getFileRowByFileOId(fileOId)
            if (fileRow) {
              fileRowArr.push(fileRow)
            }
          }
        }
      }
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
      // ::
    }
  }
  getFileRowArrByRecent() {
    return {fileRowArr: this.recentFileArr}
  }

  removeFileRowFromMemory(fileOId: string) {
    this.fileRowMap.delete(fileOId)
  }

  setFileRowToMemory(fileRow: ST.FileRowType) {
    this.fileRowMap.set(fileRow.fileOId, fileRow)
  }

  // AREA6: Private Area

  private async _bootstrap_initDirectoryMap() {
    /**
     * _bootstrap_initDirectoryMap
     *
     * 주의사항
     *   - 파일행 맵 초기화 이후에 실행되어야 한다.
     *
     * 기능
     *   1. 디렉토리 맵 초기화
     *   2. updatedAtFile 도 업데이트 한다.
     */
    const connection = await this.dbService.getConnection()
    try {
      // 1. 디렉토리들을 쿼리로 읽어오고 초기 Map 을 구성한다.
      const query = `SELECT * FROM directories`
      const [result] = await connection.execute(query)
      const resultArr = result as RowDataPacket[]

      // 1-1. 먼저 디렉토리 맵을 생성 (fileOIdsArr, subDirOIdsArr는 나중에 업데이트)
      this.directoryMap = new Map(
        resultArr.map(row => {
          const {dirOId, dirName, parentDirOId} = row
          const fileOIdsArr: string[] = [] // 나중에 DB에서 정렬된 순서로 업데이트
          const subDirOIdsArr: string[] = [] // 나중에 DB에서 정렬된 순서로 업데이트
          const updatedAtFile: Date | null = null // 나중에 업데이트
          const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr, updatedAtFile}
          return [dirOId, directory]
        })
      )

      // 1-2. 각 디렉토리의 fileOIdsArr를 DB에서 정렬된 순서로 조회하여 업데이트
      for (const [dirOId, directory] of this.directoryMap.entries()) {
        const queryFile = `SELECT fileOId FROM files WHERE dirOId = ? ORDER BY fileIdx ASC`
        const [resultFile] = await connection.execute(queryFile, [dirOId])
        const resultArrFile = resultFile as RowDataPacket[]
        directory.fileOIdsArr = resultArrFile.map(row => row.fileOId)
      }

      // 1-3. 각 디렉토리의 subDirOIdsArr를 DB에서 정렬된 순서로 조회하여 업데이트
      for (const [dirOId, directory] of this.directoryMap.entries()) {
        const querySubDir = `SELECT dirOId FROM directories WHERE parentDirOId = ? ORDER BY dirIdx ASC`
        const [resultSubDir] = await connection.execute(querySubDir, [dirOId])
        const resultArrSubDir = resultSubDir as RowDataPacket[]
        directory.subDirOIdsArr = resultArrSubDir.map(row => row.dirOId)
      }

      // 2. 각 디렉토리의 updatedAtFile을 해당 디렉토리의 파일들 중 최신 updatedAt으로 설정
      for (const [dirOId, directory] of this.directoryMap.entries()) {
        let maxUpdatedAt: Date | null = null

        // 2-1. 해당 디렉토리의 파일들 중 최신 updatedAt 찾기
        for (const fileOId of directory.fileOIdsArr) {
          const fileRow = this.fileRowMap.get(fileOId)
          if (fileRow) {
            const updatedAt = fileRow.updatedAt
            if (!maxUpdatedAt || updatedAt > maxUpdatedAt) {
              maxUpdatedAt = updatedAt
            }
          }
        }

        directory.updatedAtFile = maxUpdatedAt
      }

      // 3. 부모 디렉토리로 올라가면서 updatedAtFile 업데이트 (null 체크 포함)
      for (const [dirOId, directory] of this.directoryMap.entries()) {
        if (!directory.updatedAtFile) continue

        let parentDirOId = directory.parentDirOId
        if (!parentDirOId) continue

        let parentDirectory = this.directoryMap.get(parentDirOId)
        while (parentDirectory) {
          if (!parentDirectory.updatedAtFile || directory.updatedAtFile > parentDirectory.updatedAtFile) {
            parentDirectory.updatedAtFile = directory.updatedAtFile
          }
          parentDirOId = parentDirectory.parentDirOId
          if (!parentDirOId) break
          parentDirectory = this.directoryMap.get(parentDirOId)
        }
      }
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
  private async _bootstrap_initFileRowMap() {
    /**
     * _bootstrap_initFileRowMap
     *
     * 주의사항
     *   - 디렉토리보다 꼭 먼저 실행되어야 한다.
     *   - 파일행의 정보를 디렉토리맵 초기화할때 사용한다.
     *
     * 기능
     *   1. 파일행 맵 초기화
     */
    const connection = await this.dbService.getConnection()
    try {
      // 1. 파일 맵 초기화
      const query = `SELECT * FROM files`
      const [result] = await connection.execute(query)
      const resultArr = result as RowDataPacket[]
      this.fileRowMap = new Map(
        resultArr.map(file => {
          const {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt} = file
          const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
          return [fileOId, fileRow]
        })
      )
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
  private async _bootstrap_initRecentFileArr() {
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
      console.log(`[CacheDBService(Bootstrap)] 최근 게시물 목록 초기화 실패`)
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

  private _get_updatedAtFile_InMemory_recursively(dirOId: string): Date | null {
    const directory = this.directoryMap.get(dirOId)
    let result = null

    // 1. 디렉토리의 자식 파일중에서 가장 최근값 찾기
    for (const fileOId of directory.fileOIdsArr) {
      const fileRow = this.fileRowMap.get(fileOId)
      if (fileRow) {
        const updatedAt = fileRow.updatedAt
        if (!result || updatedAt > result) {
          result = updatedAt
        }
      }
    }

    // 2. 디렉토리의 자식 폴더중에서 가장 최근값 찾기
    for (const subDirOId of directory.subDirOIdsArr) {
      const subDirectory = this.directoryMap.get(subDirOId)
      if (subDirectory) {
        const updatedAt = this._get_updatedAtFile_InMemory_recursively(subDirOId)
        if (updatedAt && (!result || updatedAt > result)) {
          result = updatedAt
        }
      }
    }

    // 3. 현재 디렉토리의 값을 여기서 바꿔줘야 재귀적으로 바뀐다.
    directory.updatedAtFile = result

    // 4. 조상 폴더로 거슬러 올라가면서 갱신
    let parentDirOId = directory.parentDirOId
    if (!parentDirOId) return result

    let parentDir = this.directoryMap.get(parentDirOId)

    while (parentDir) {
      let parentsValue = null
      // 4-1. 조상 폴더의 자식폴더 데이터의 최근값 탐색
      for (const subDirOId of parentDir.subDirOIdsArr) {
        const subDirectory = this.directoryMap.get(subDirOId)
        if (subDirectory) {
          const updatedAt = subDirectory.updatedAtFile
          if (updatedAt && (!parentsValue || updatedAt > parentsValue)) {
            parentsValue = updatedAt
          }
        }
      }

      // 4-2. 조상 폴더의 자식파일중 가장 최근 날짜값 탐색
      for (const fileOId of parentDir.fileOIdsArr) {
        const fileRow = this.fileRowMap.get(fileOId)
        if (fileRow) {
          const updatedAt = fileRow.updatedAt
          if (updatedAt && (!parentsValue || updatedAt > parentsValue)) {
            parentsValue = updatedAt
          }
        }
      }

      // 4-3. 조상폴더의 값이 더 낮으면 갱신
      if (result !== null && (parentsValue === null || parentsValue < result)) {
        parentDir.updatedAtFile = result
        // ::
      } // 4-4. 조상폴더의 값이 같거나 높으면 종료
      else if (result === null || result === parentsValue || (parentsValue !== null && parentsValue > result)) {
        break
      }
      parentDirOId = parentDir.parentDirOId
      if (!parentDirOId) break
      parentDir = this.directoryMap.get(parentDirOId)
    }

    return result
  }
}
