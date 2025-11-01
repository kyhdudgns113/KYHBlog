import {createContext, useCallback, useContext} from 'react'

import {useCommentActions, useDirectoryActions, useFileActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  editFile: (fileOId: string, fileName: string, content: string) => Promise<boolean>
  editFileStatus: (fileOId: string, newFileStatus: number) => Promise<boolean>    

  loadComments: (fileOId: string) => Promise<boolean>
  loadFile: (fileOId: string) => Promise<boolean>
  loadNoticeFile: () => Promise<boolean>
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  editFile: () => Promise.resolve(false),
  editFileStatus: () => Promise.resolve(false),

  loadComments: () => Promise.resolve(false),
  loadFile: () => Promise.resolve(false),
  loadNoticeFile: () => Promise.resolve(false),
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setFile, setFileOId, setFileUser} = useFileActions()
  const {setCommentReplyArr} = useCommentActions()
  const {writeExtraDirectory, writeExtraFileRow} = useDirectoryActions()

  // PUT AREA:

  const editFile = useCallback(
    (fileOId: string, fileName: string, content: string) => {
      const url = `/client/file/editFile`
      const data: HTTP.EditFileType = {fileOId, fileName, content}

      return F.putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {extraDirs, extraFileRows} = body
            writeExtraDirectory(extraDirs)
            writeExtraFileRow(extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            alert(`파일 수정 완료`)
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

  const editFileStatus = useCallback(async (fileOId: string, newFileStatus: number) => {
    const url = `/client/file/editFileStatus`
    const data: HTTP.EditFileStatusType = {fileOId, newFileStatus}

    return F.putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          writeExtraDirectory(body.extraDirs)
          writeExtraFileRow(body.extraFileRows)
          setFile(body.file)
          U.writeJwtFromServer(jwtFromServer)
          alert(`파일 상태 수정 완료`)
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // GET AREA:

  const loadComments = useCallback(
    async (fileOId: string) => {
      const url = `/client/file/loadComments/${fileOId}`
      const NULL_JWT = ''

      return F.get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setCommentReplyArr(body.commentReplyArr)
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

  const loadFile = useCallback(
    async (fileOId: string) => {
      const url = `/client/file/loadFile/${fileOId}`
      const NULL_JWT = ''

      return F.get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setFile(body.file)
            setFileUser(body.user)
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
    [setFile, setFileUser]
  )

  const loadNoticeFile = useCallback(
    async () => {
      const url = `/client/file/loadNoticeFile`
      const NULL_JWT = ''

      return F.get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setFile(body.file)
            setFileOId(body.file.fileOId) // 이거 안해주면 file useEffect 때문에 에러난다
            setFileUser(body.user)
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
    editFile,
    editFileStatus,
    
    loadComments,
    loadFile,
    loadNoticeFile,
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
