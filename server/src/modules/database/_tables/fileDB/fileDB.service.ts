import {Injectable, OnApplicationBootstrap} from '@nestjs/common'
import {DBService} from '../_db'
import {RowDataPacket} from 'mysql2'
import {DirectoryType, FileRowType, FileType} from '@shareType'
import {FILE_NORMAL, FILE_NOTICE} from '@secret'
import {generateObjectId} from '@util'

import * as ST from '@shareType'
import * as SV from '@shareValue'
import * as T from '@type'
import * as DTO from '@dto'

@Injectable()
export class FileDBService implements OnApplicationBootstrap {
  private readonly NUM_FILE = 10

  private recentFileArr: ST.FileRowType[] = []

  async onApplicationBootstrap() {
    const where = 'FileDBService/onApplicationBootstrap'
    const connection = await this.dbService.getConnection()
    try {
      // 1. 최근 10개 파일 조회
      const query = `SELECT * FROM files WHERE fileStatus != ? ORDER BY updatedAt DESC LIMIT ${this.NUM_FILE}`
      const params = [SV.FILE_HIDDEN]
      const [result] = await connection.execute(query, params)
      const resultArr = result as RowDataPacket[]

      const fileRowArr: ST.FileRowType[] = resultArr.map(file => {
        const {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt} = file
        const fileRow: ST.FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
        return fileRow
      })

      // 2. 생성된지 72시간이 지나지 않은 것만 필터링
      const now = new Date()
      const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000)

      this.recentFileArr = fileRowArr.filter(fileRow => {
        const createdAt = new Date(fileRow.createdAt)
        return createdAt >= seventyTwoHoursAgo
      })
      // ::
    } catch (errObj) {
      // ::
      // 초기화 실패 시 빈 배열로 유지
      console.log(`[FileDBService] 최근 게시물 목록 초기화 실패`)
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

  constructor(private readonly dbService: DBService) {}

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
          gkdErrCode: 'FILEDB_createFile_InvalidDirOId',
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
      const file: FileType = {
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
            gkdErrCode: 'FILEDB_createFile_DuplicateFileName',
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

      const file: FileType = {fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId, content, createdAt, updatedAt}

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

      const file: FileType = {fileOId, fileName, dirOId, fileIdx, fileStatus, userName, userOId, content, createdAt, updatedAt}

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

      const fileRowArr: FileRowType[] = resultArr.map(row => {
        const {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt} = row

        const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

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
          gkdErrCode: 'FILEDB_updateFileName_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId, fileName},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {dirOId, fileStatus, createdAt, updatedAt} = resultArr[0]

      const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

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
            gkdErrCode: 'FILEDB_updateFileName_DuplicateFileName',
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
          gkdErrCode: 'FILEDB_updateFileNameContent_InvalidFileOId',
          gkdErrMsg: `존재하지 않는 파일`,
          gkdStatus: {fileOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType // ::
      }

      const {dirOId, fileStatus, createdAt, updatedAt} = resultArr[0]

      const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}

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
          gkdErrCode: 'FILEDB_deleteFile_InvalidFileOId',
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

      const directory: DirectoryType = {
        dirName,
        dirOId,
        fileOIdsArr,
        parentDirOId,
        subDirOIdsArr,
      }

      const fileRowArr: FileRowType[] = fileArr.map(row => {
        const {fileOId, fileName, fileStatus, createdAt, updatedAt} = row
        const fileRow: FileRowType = {fileOId, fileName, dirOId, fileStatus, createdAt, updatedAt}
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

  // PRIVATE AREA:

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
}
