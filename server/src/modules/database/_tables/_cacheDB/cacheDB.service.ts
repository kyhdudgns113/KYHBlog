import {Injectable, OnApplicationBootstrap} from '@nestjs/common'
import {DBService} from '../__db'
import {RowDataPacket} from 'mysql2'
import {generateObjectId} from '@util'

import * as ST from '@shareType'
import * as SV from '@shareValue'

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

  // AREA6: Private Area

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

      // 1-1. 먼저 디렉토리 맵을 생성 (subDirOIdsArr는 나중에 업데이트)
      this.directoryMap = new Map(
        resultArr.map(row => {
          const {dirOId, dirName, parentDirOId} = row
          const fileOIdsArr = Array.from(this.fileRowMap.keys()).filter(fileOId => this.fileRowMap.get(fileOId)?.dirOId === dirOId)
          const subDirOIdsArr: string[] = [] // 나중에 업데이트
          const updatedAtFile: Date | null = null // 나중에 업데이트
          const directory: ST.DirectoryType = {dirOId, dirName, parentDirOId, fileOIdsArr, subDirOIdsArr, updatedAtFile}
          return [dirOId, directory]
        })
      )

      // 1-2. subDirOIdsArr 업데이트
      for (const [dirOId, directory] of this.directoryMap.entries()) {
        const subDirOIdsArr = Array.from(this.directoryMap.keys()).filter(subDirOId => this.directoryMap.get(subDirOId)?.parentDirOId === dirOId)
        directory.subDirOIdsArr = subDirOIdsArr
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
}
