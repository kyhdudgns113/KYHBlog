import {createContext, useCallback, useContext} from 'react'

import {useBlogSelector, useDirectoryActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as SV from '@shareValue'
import * as U from '@util'

import type {APIReturnType} from '@type'

// prettier-ignore
type ContextType = {

  addDirectory: (parentDirOId: string, dirName: string) => Promise<APIReturnType>
  addFile: (dirOId: string, fileName: string) => Promise<APIReturnType>

  changeDirName: (dirOId: string, dirName: string) => Promise<APIReturnType>  
  changeFileName: (fileOId: string, fileName: string) => Promise<APIReturnType>

  loadDirectory: (dirOId: string) => Promise<APIReturnType>
  loadRootDirectory: () => Promise<APIReturnType>
  moveDirectory: (parentDirOId: string, moveDirOId: string, dirIdx: number | null) => Promise<APIReturnType>
  moveFile: (dirOId: string, moveFileOId: string, fileIdx: number | null) => Promise<APIReturnType>

  deleteDir: (dirOId: string) => Promise<APIReturnType>
  deleteFile: (fileOId: string) => Promise<APIReturnType>
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  addDirectory: async () => ({isSuccess: false}),
  addFile: async () => ({isSuccess: false}),

  changeDirName: async () => ({isSuccess: false}),
  changeFileName: async () => ({isSuccess: false}),

  loadDirectory: async () => ({isSuccess: false}),
  loadRootDirectory: async () => ({isSuccess: false}),
  moveDirectory: async () => ({isSuccess: false}),
  moveFile: async () => ({isSuccess: false}),

  deleteDir: async () => ({isSuccess: false}),
  deleteFile: async () => ({isSuccess: false}),
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const directories = useBlogSelector(state => state.directory.directories)
  const fileRows = useBlogSelector(state => state.directory.fileRows)

  const {initDirectories, initFileRows, setRootDirOId, writeExtraDirectory, writeExtraFileRow} = useDirectoryActions()

  // POST AREA:

  const addDirectory = useCallback(
    async (parentDirOId: string, dirName: string) => {
      const url = `/client/directory/addDirectory`
      const data: HTTP.AddDirectoryType = {
        dirName,
        parentDirOId,
      }

      // 입력값 검증: 폴더 이름이 들어왔는가
      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return {isSuccess: false}
      }

      // 입력값 검증: 폴더 이름이 32자 이하인가
      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return {isSuccess: false}
      }

      return F.postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const addFile = useCallback(
    async (dirOId: string, fileName: string) => {
      const url = `/client/directory/addFile`
      const data: HTTP.AddFileType = {
        fileName,
        dirOId,
      }

      // 입력값 검증: 파일 이름이 들어왔는가
      if (!fileName.trim()) {
        alert(`파일 이름을 입력하세요`)
        return {isSuccess: false}
      }

      // 입력값 검증: 파일 이름이 20자 이하인가
      if (fileName.length > SV.FILE_NAME_MAX_LENGTH) {
        alert(`파일 이름은 ${SV.FILE_NAME_MAX_LENGTH}자 이하로 입력하세요`)
        return {isSuccess: false}
      }

      return F.postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // PUT AREA:

  const changeDirName = useCallback(
    async (dirOId: string, dirName: string) => {
      const url = `/client/directory/changeDirName`
      const data: HTTP.ChangeDirNameType = {
        dirName,
        dirOId,
      }

      // 입력값 검증: 폴더 이름이 들어왔는가
      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return {isSuccess: false}
      }

      // 입력값 검증: 폴더 이름이 32자 이하인가
      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return {isSuccess: false}
      }

      // 입력값 검증: 폴더 이름이 안 바뀌었는가
      const oldDirName = directories[dirOId].dirName
      if (oldDirName === dirName) {
        alert(`폴더 이름이 바뀌지 않았어요`)
        return {isSuccess: false}
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [directories] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const changeFileName = useCallback(
    async (fileOId: string, fileName: string) => {
      const url = `/client/directory/changeFileName`
      const data: HTTP.ChangeFileNameType = {
        fileName,
        fileOId,
      }

      // 입력값 검증: 파일 이름이 들어왔는가
      if (!fileName.trim()) {
        return Promise.resolve({isSuccess: false})
      }

      // 입력값 검증: 파일 이름이 20자 이하인가
      if (fileName.length > SV.FILE_NAME_MAX_LENGTH) {
        alert(`파일 이름은 ${SV.FILE_NAME_MAX_LENGTH}자 이하로 입력하세요`)
        return Promise.resolve({isSuccess: false})
      }

      // 입력값 검증: 파일 이름이 안 바뀌었는가
      const oldFileName = fileRows[fileOId].fileName
      if (oldFileName === fileName) {
        alert(`파일 이름이 바뀌지 않았어요`)
        return Promise.resolve({isSuccess: false})
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [fileRows] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // GET AREA:

  const loadDirectory = useCallback(
    async (dirOId: string) => {
      const url = `/client/directory/loadDirectory/${dirOId}`
      const NULL_JWT = ''

      return F.get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res
          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [writeExtraDirectory, writeExtraFileRow]
  )

  const loadRootDirectory = useCallback(async () => {
    const url = '/client/directory/loadRootDirectory'
    const NULL_JWT = ''

    return F.get(url, NULL_JWT)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        initDirectories()
        initFileRows()

        if (ok) {
          setRootDirOId(body.rootDirOId)
          writeExtraDirectory(body.extraDirs)
          writeExtraFileRow(body.extraFileRows)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, [initDirectories, initFileRows, setRootDirOId, writeExtraDirectory, writeExtraFileRow])

  const moveDirectory = useCallback(
    async (parentDirOId: string, moveDirOId: string, dirIdx: number | null) => {
      /**
       * 입력값 검증 1: 같은 위치로 이동하는건 아닌가 확인
       *
       * - 같은 위치로 이동하는 경우를 확인한다.
       * - dirIdx 가 null 로 들어왔는데 같은 위치로 이동하는 경우인것도 고려한다
       * - 에러조차 출력하지 않는다.
       */
      const newParentDirOId = parentDirOId
      const newParentDir = directories[parentDirOId]
      const moveDir = directories[moveDirOId]
      const samePrevIdx = newParentDir.subDirOIdsArr.indexOf(moveDirOId)

      if (moveDir.parentDirOId === parentDirOId) {
        const isSameIdx = dirIdx === samePrevIdx
        const nullIsSameIdx = dirIdx === null && samePrevIdx === newParentDir.subDirOIdsArr.length - 1

        if (isSameIdx || nullIsSameIdx) {
          return {isSuccess: false}
        }
      }

      /**
       * 입력값 검증 2: 조상이 자손으로 이동을 시도한다면 아무 작업도 하지 않는다.
       *
       * - 조상이 자손으로 이동을 시도한다면 아무 작업도 하지 않는다.
       * - 에러조차 출력하지 않는다.
       */
      let tempDir = newParentDir

      while (tempDir.dirOId !== null && tempDir.parentDirOId !== null) {
        if (tempDir.dirOId === moveDirOId) {
          alert(`자손 폴더로는 이동할 수 없습니다.`)
          return {isSuccess: false}
        }

        const nextOId = tempDir.parentDirOId
        const nextDirName = tempDir.dirName
        tempDir = directories[nextOId]

        if (!tempDir) {
          alert(`${nextDirName}의 부모폴더 정보가 없습니다.`)
          return {isSuccess: false}
        }
      }

      /**
       * 클라이언트 작업: 폴더 이동 후 부모 폴더의 자식 폴더 배열 변경
       *
       * 1. 기존 부모 폴더의 자식 폴더 배열에서 움직일 폴더 제거
       * 2. 새 부모 폴더의 자식 폴더 배열에 움직일 폴더 추가
       */

      const oldParentDirOId = moveDir.parentDirOId ?? ''
      const oldParentDir = directories[oldParentDirOId]
      const isSameParent = oldParentDirOId === newParentDirOId

      // 1. 기존 부모 폴더의 자식 폴더 배열에서 움직일 폴더 제거
      const oldParentChildArr = [...oldParentDir.subDirOIdsArr]

      // 2. 새 부모 폴더의 자식 폴더 배열의 dirIdx 번째에 움직일 폴더 추가
      const newParentChildArr = [...newParentDir.subDirOIdsArr]
      // newParentChildArr.splice(dirIdx ?? newParentChildArr.length, 0, moveDirOId)

      if (isSameParent) {
        const prevIdx = oldParentChildArr.indexOf(moveDirOId)
        oldParentChildArr.splice(prevIdx, 1)
        newParentChildArr.splice(prevIdx, 1)
        oldParentChildArr.splice(dirIdx ?? newParentChildArr.length, 0, moveDirOId)
        newParentChildArr.splice(dirIdx ?? newParentChildArr.length, 0, moveDirOId)
      } // ::
      else {
        const prevIdx = oldParentChildArr.indexOf(moveDirOId)
        oldParentChildArr.splice(prevIdx, 1)
        newParentChildArr.splice(dirIdx ?? newParentChildArr.length, 0, moveDirOId)
      }

      /**
       * HTTP 요청
       */
      const url = `/client/directory/moveDirectory`
      const data: HTTP.MoveDirectoryType = {
        moveDirOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId,
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [directories] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const moveFile = useCallback(
    async (dirOId: string, moveFileOId: string, fileIdx: number | null) => {
      // 입력값 검증: 같은 위치로 이동하는건 아닌가 확인
      const fileRow = fileRows[moveFileOId]

      const newParentDirOId = dirOId
      const newParentDir = directories[dirOId]
      const oldParentDirOId = fileRow.dirOId
      const oldParentDir = directories[oldParentDirOId]

      const isSameParent = oldParentDirOId === newParentDirOId

      const samePrevIdx = newParentDir.fileOIdsArr.indexOf(moveFileOId)

      if (fileRow.dirOId === dirOId) {
        const isSameIdx = fileIdx === samePrevIdx
        const nullIsSameIdx = fileIdx === null && samePrevIdx === newParentDir.fileOIdsArr.length - 1

        if (isSameIdx || nullIsSameIdx) {
          return {isSuccess: false}
        }
      }

      /**
       * 클라이언트 작업: 파일 이동 후 부모 폴더의 자식 파일 배열 변경
       *
       * 1. 기존 부모 폴더의 자식 파일 배열에서 움직일 파일 제거
       * 2. 새 부모 폴더의 자식 파일 배열의 fileIdx 번째에 움직일 파일 추가
       */

      // 1. 기존 부모 폴더의 자식 파일 배열에서 움직일 파일 제거
      const oldParentChildArr = [...oldParentDir.fileOIdsArr]

      // 2. 새 부모 폴더의 자식 파일 배열의 fileIdx 번째에 움직일 파일 추가
      const newParentChildArr = [...newParentDir.fileOIdsArr]

      if (isSameParent) {
        const prevIdx = oldParentChildArr.indexOf(moveFileOId)
        oldParentChildArr.splice(prevIdx, 1)
        newParentChildArr.splice(prevIdx, 1)
        oldParentChildArr.splice(fileIdx ?? newParentChildArr.length, 0, moveFileOId)
        newParentChildArr.splice(fileIdx ?? newParentChildArr.length, 0, moveFileOId)
      } // ::
      else {
        const prevIdx = oldParentChildArr.indexOf(moveFileOId)
        oldParentChildArr.splice(prevIdx, 1)
        newParentChildArr.splice(fileIdx ?? newParentChildArr.length, 0, moveFileOId)
      }

      const url = `/client/directory/moveFile`
      const data: HTTP.MoveFileType = {
        moveFileOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId,
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [directories, fileRows] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // DELETE AREA:

  const deleteDir = useCallback(
    async (dirOId: string) => {
      const url = `/client/directory/deleteDirectory/${dirOId}`
      const NULL_JWT = ''

      return F.delWithJwt(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {extraDirs, extraFileRows} = body
            writeExtraDirectory(extraDirs)
            writeExtraFileRow(extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const deleteFile = useCallback(
    async (fileOId: string) => {
      const url = `/client/directory/deleteFile/${fileOId}`
      const NULL_JWT = ''

      return F.delWithJwt(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return {isSuccess: true}
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return {isSuccess: false}
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return {isSuccess: false}
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // prettier-ignore
  const value: ContextType = {
    addDirectory,
    addFile,

    changeDirName,
    changeFileName,
    
    loadDirectory,
    loadRootDirectory,
    moveDirectory,
    moveFile,
    
    deleteDir,
    deleteFile,
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
