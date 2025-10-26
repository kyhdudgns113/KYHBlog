import {Injectable} from '@nestjs/common'
import {JwtPayloadType} from '@type'
import {ClientDirPortService} from '@modules/database'
import * as U from '@util'
import * as HTTP from '@httpDataType'

@Injectable()
export class ClientDirectoryService {
  constructor(private readonly portService: ClientDirPortService) {}

  // POST AREA:

  async addDirectory(jwtPayload: JwtPayloadType, data: HTTP.AddDirectoryType) {
    /**
     * parentDirOId 디렉토리에 dirName 이라는 디렉토리를 추가한다
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.addDirectory(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async addFile(jwtPayload: JwtPayloadType, data: HTTP.AddFileType) {
    /**
     * dirOId 디렉토리에 fileName 이라는 파일을 추가한다
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.addFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // PUT AREA:

  async changeDirName(jwtPayload: JwtPayloadType, data: HTTP.ChangeDirNameType) {
    /**
     * dirOId 디렉토리의 이름을 dirName 으로 변경한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.changeDirName(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async changeFileName(jwtPayload: JwtPayloadType, data: HTTP.ChangeFileNameType) {
    /**
     * fileOId 파일의 이름을 fileName 으로 변경한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.changeFileName(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async moveDirectory(jwtPayload: JwtPayloadType, data: HTTP.MoveDirectoryType) {
    /**
     * moveDirOId 디렉토리를 parentDirOId 디렉토리의 dirIdx 번째 인덱스로 이동한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.moveDirectory(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async moveFile(jwtPayload: JwtPayloadType, data: HTTP.MoveFileType) {
    /**
     * moveFileOId 파일을 moveDirOId 디렉토리의 dirIdx 번째 인덱스로 이동한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.moveFile(jwtPayload, data)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // GET AREA:

  async loadDirectory(dirOId: string) {
    /**
     * dirOId 디렉토리와 그 자식파일행의 정보를 읽어온다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.loadDirectory(dirOId)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async loadRootDirectory() {
    const where = `/client/directory/loadRootDirectory`
    /**
     * 루트 디렉토리의 정보를 요청한다.
     */
    try {
      const {rootDirOId, extraDirs, extraFileRows} = await this.portService.loadRootDirectory()

      return {ok: true, body: {rootDirOId, extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  // DELETE AREA:

  async deleteDirectory(jwtPayload: JwtPayloadType, dirOId: string) {
    /**
     * dirOId 디렉토리를 삭제한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.deleteDirectory(jwtPayload, dirOId)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }

  async deleteFile(jwtPayload: JwtPayloadType, fileOId: string) {
    /**
     * fileOId 파일을 삭제한다.
     */
    try {
      const {extraDirs, extraFileRows} = await this.portService.deleteFile(jwtPayload, fileOId)
      return {ok: true, body: {extraDirs, extraFileRows}, gkdErrMsg: '', statusCode: 200}
      // ::
    } catch (errObj) {
      // ::
      return U.getFailResponse(errObj)
    }
  }
}
