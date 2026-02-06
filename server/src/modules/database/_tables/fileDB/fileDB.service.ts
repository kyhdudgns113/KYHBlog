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
export class FileDBService {
  constructor(
    private readonly cacheDBService: CacheDBService,
    private readonly dbService: DBService
  ) {}

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

      const {directory: parentDir} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (!parentDir) {
        throw {
          gkd: {dirOId: `부모 디렉토리가 DB에 존재하지 않음`},
          gkdErrCode: 'DIRECTORYFILEDB_createFile_DirectoryNotFound',
          gkdErrMsg: `부모 디렉토리가 DB에 존재하지 않음`,
          gkdStatus: {dirOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType
      }

      fileIdx = parentDir.fileOIdsArr.length

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
      this.cacheDBService.addToRecentFileArr(fileRow)

      // 7. 메모리에 파일 추가
      this.cacheDBService.setFileRowToMemory(fileRow)

      // 8. 부모폴더의 자식폴더 목록 갱신
      parentDir.fileOIdsArr.push(fileOId)

      // 9. 부모폴더의 updatedAtFile 갱신
      this.cacheDBService.updateDirectoryUpdatedAtFile(dirOId)

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
      const param = [SV.FILE_NOTICE]
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
  async readFileRowArrAll(where: string) {
    try {
      const {fileRowArr} = await this.cacheDBService.getFileRowArrAll()
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
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
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByRecent()
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }
  async readFileRowArrByDirOId(where: string, dirOId: string) {
    try {
      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])
      return {fileRowArr}
      // ::
    } catch (errObj) {
      // ::
      throw errObj
    }
  }

  async updateFileName(where: string, fileOId: string, fileName: string) {
    where = where + '/updateFileName'

    const connection = await this.dbService.getConnection()
    try {
      // 1. (쿼리) 파일 이름 수정
      const queryUpdate = `UPDATE files SET fileName = ? WHERE fileOId = ?`
      const paramsUpdate = [fileName, fileOId]
      await connection.execute(queryUpdate, paramsUpdate)

      // 2. 메모리에 있는 파일 이름 갱신
      const {fileRow} = await this.cacheDBService.getFileRowByFileOId(fileOId)
      fileRow.fileName = fileName
      fileRow.updatedAt = new Date()

      // 3. recentFileArr에 추가
      this.cacheDBService.addToRecentFileArr(fileRow)

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

      // 2. 메모리에 있는 파일행 정보 갱신
      const {fileRow} = await this.cacheDBService.getFileRowByFileOId(fileOId)
      fileRow.fileName = fileName
      fileRow.updatedAt = new Date()

      // 3. recentFileArr에 추가
      this.cacheDBService.addToRecentFileArr(fileRow)

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
      // 1. 만약 공지파일로 바꾸는 거라면, 이전의 공지파일을 일반 파일로 바꾼다.
      if (fileStatus === SV.FILE_NOTICE) {
        // 1-1. (쿼리) 기존 공지파일이 있으면 일반 파일로 바꾼다.
        const query = `UPDATE files SET fileStatus = ? WHERE fileStatus = ?`
        const param = [SV.FILE_NORMAL, SV.FILE_NOTICE]
        await connection.execute(query, param)

        // 1-2. 메모리도 갱신해줘야 한다.
        this.cacheDBService.changeAllFileStatusToNormal()
      }

      // 2. (쿼리) 현재 파일 상태 수정
      const query = `UPDATE files SET fileStatus = ? WHERE fileOId = ?`
      const params = [fileStatus, fileOId]
      await connection.execute(query, params)

      // 3. 메모리에 있는 파일행 정보도 갱신한다.
      const {fileRow} = await this.cacheDBService.getFileRowByFileOId(fileOId)
      fileRow.fileStatus = fileStatus
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

      // 3. 메모리에 있는 파일행 정보 삭제
      this.cacheDBService.removeFileRowFromMemory(fileOId)

      // 4. 메모리에 있는 부모폴더의 자식파일 목록에서 현재 파일 제거
      const {directory} = await this.cacheDBService.getDirectoryByDirOId(dirOId)
      if (!directory) {
        throw {
          gkd: {dirOId: `부모 디렉토리가 메모리에 존재하지 않음`},
          gkdErrCode: 'DIRECTORYFILEDB_deleteFile_ParentDirectoryNotFound',
          gkdErrMsg: `부모 디렉토리가 메모리에 존재하지 않음`,
          gkdStatus: {dirOId},
          statusCode: 400,
          where,
        } as T.ErrorObjType
      }

      directory.fileOIdsArr = directory.fileOIdsArr.filter(_fileOId => _fileOId !== fileOId)

      const {fileRowArr} = await this.cacheDBService.getFileRowArrByDirOIdArr([dirOId])

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
}
