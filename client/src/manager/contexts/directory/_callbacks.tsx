import {createContext, useCallback, useContext} from 'react'

import {useDirectoryActions, useDirectoryStates} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as SV from '@shareValue'
import * as U from '@util'

// prettier-ignore
type ContextType = {

  addDirectory: (parentDirOId: string, dirName: string) => Promise<boolean>
  addFile: (dirOId: string, fileName: string) => Promise<boolean>

  changeDirName: (dirOId: string, dirName: string) => Promise<boolean>  

  loadDirectory: (dirOId: string) => Promise<boolean>
  loadRootDirectory: () => Promise<boolean>
  moveDirectory: (parentDirOId: string, moveDirOId: string, dirIdx: number | null) => Promise<boolean>
  moveFile: (dirOId: string, moveFileOId: string, fileIdx: number | null) => Promise<boolean>

  deleteDir: (dirOId: string) => Promise<boolean>
  deleteFile: (fileOId: string) => Promise<boolean>
}
// prettier-ignore
export const DirectoryCallbacksContext = createContext<ContextType>({
  addDirectory: async () => false,
  addFile: async () => false,

  changeDirName: async () => false,

  loadDirectory: async () => false,
  loadRootDirectory: async () => false,
  moveDirectory: async () => false,
  moveFile: async () => false,

  deleteDir: async () => false,
  deleteFile: async () => false,
})

export const useDirectoryCallbacksContext = () => useContext(DirectoryCallbacksContext)

export const DirectoryCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {directories, fileRows} = useDirectoryStates()
  const {initDirectories, initFileRows, setRootDirOId, writeExtraDirectory, writeExtraFileRow} = useDirectoryActions()

  // POST AREA:

  const addDirectory = useCallback(
    async (parentDirOId: string, dirName: string) => {
      const url = `/client/directory/addDirectory`
      const data: HTTP.AddDirectoryType = {
        dirName,
        parentDirOId
      }

      // 입력값 검증: 폴더 이름이 들어왔는가
      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return false
      }

      // 입력값 검증: 폴더 이름이 32자 이하인가
      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return false
      }

      return F.postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const addFile = useCallback(
    async (dirOId: string, fileName: string) => {
      const url = `/client/directory/addFile`
      const data: HTTP.AddFileType = {
        fileName,
        dirOId
      }

      // 입력값 검증: 파일 이름이 들어왔는가
      if (!fileName.trim()) {
        alert(`파일 이름을 입력하세요`)
        return false
      }

      // 입력값 검증: 파일 이름이 20자 이하인가
      if (fileName.length > SV.FILE_NAME_MAX_LENGTH) {
        alert(`파일 이름은 ${SV.FILE_NAME_MAX_LENGTH}자 이하로 입력하세요`)
        return false
      }

      return F.postWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
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
        dirOId
      }

      // 입력값 검증: 폴더 이름이 들어왔는가
      if (!dirName.trim()) {
        alert(`폴더 이름을 입력하세요`)
        return false
      }

      // 입력값 검증: 폴더 이름이 32자 이하인가
      if (dirName.length > 32) {
        alert(`폴더 이름은 32자 이하로 입력하세요`)
        return false
      }

      // 입력값 검증: 폴더 이름이 안 바뀌었는가
      const oldDirName = directories[dirOId].dirName
      if (oldDirName === dirName) {
        alert(`폴더 이름이 바뀌지 않았어요`)
        return false
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
        })
    },
    [directories] // eslint-disable-line react-hooks/exhaustive-deps
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
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
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
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
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
          return false
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
          return false
        }

        const nextOId = tempDir.parentDirOId
        const nextDirName = tempDir.dirName
        tempDir = directories[nextOId]

        if (!tempDir) {
          alert(`${nextDirName}의 부모폴더 정보가 없습니다.`)
          return false
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

      // 1. 기존 부모 폴더의 자식 폴더 배열에서 움직일 폴더 제거
      const oldParentChildArr = [...oldParentDir.subDirOIdsArr]
      const prevIdx = oldParentChildArr.indexOf(moveDirOId)
      oldParentChildArr.splice(prevIdx, 1)

      // 2. 새 부모 폴더의 자식 폴더 배열의 dirIdx 번째에 움직일 폴더 추가
      const newParentChildArr = [...newParentDir.subDirOIdsArr]
      const idxOfNewParent = newParentChildArr.indexOf(moveDirOId)
      if (idxOfNewParent !== -1) {
        newParentChildArr.splice(idxOfNewParent, 1)
      }
      newParentChildArr.splice(dirIdx ?? newParentChildArr.length, 0, moveDirOId)

      /**
       * HTTP 요청
       */
      const url = `/client/directory/moveDirectory`
      const data: HTTP.MoveDirectoryType = {
        moveDirOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
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

      const samePrevIdx = newParentDir.fileOIdsArr.indexOf(moveFileOId)

      if (fileRow.dirOId === dirOId) {
        const isSameIdx = fileIdx === samePrevIdx
        const nullIsSameIdx = fileIdx === null && samePrevIdx === newParentDir.fileOIdsArr.length - 1

        if (isSameIdx || nullIsSameIdx) {
          return false
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
      const prevIdx = oldParentChildArr.indexOf(moveFileOId)
      oldParentChildArr.splice(prevIdx, 1)

      // 2. 새 부모 폴더의 자식 파일 배열의 fileIdx 번째에 움직일 파일 추가
      const newParentChildArr = [...newParentDir.fileOIdsArr]
      const idxOfNewParent = newParentChildArr.indexOf(moveFileOId)
      if (idxOfNewParent !== -1) {
        newParentChildArr.splice(idxOfNewParent, 1)
      }
      newParentChildArr.splice(fileIdx ?? newParentChildArr.length, 0, moveFileOId)

      const url = `/client/directory/moveFile`
      const data: HTTP.MoveFileType = {
        moveFileOId,
        oldParentChildArr,
        oldParentDirOId,
        newParentChildArr,
        newParentDirOId
      }

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            writeExtraDirectory(body.extraDirs)
            writeExtraFileRow(body.extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
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
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
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
            return true
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            return false
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          return false
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // prettier-ignore
  const value: ContextType = {
    addDirectory,
    addFile,

    changeDirName,

    loadDirectory,
    loadRootDirectory,
    moveDirectory,
    moveFile,
    
    deleteDir,
    deleteFile,
  }
  return <DirectoryCallbacksContext.Provider value={value}>{children}</DirectoryCallbacksContext.Provider>
}
