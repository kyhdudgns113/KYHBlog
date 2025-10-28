import {createContext, useCallback, useContext} from 'react'

import {useFileActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  loadComments: (fileOId: string) => Promise<boolean>
  loadFile: (fileOId: string) => Promise<boolean>
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  loadComments: () => Promise.resolve(false),
  loadFile: () => Promise.resolve(false)
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setCommentReplyArr, setFile, setFileUser} = useFileActions()

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

  // prettier-ignore
  const value: ContextType = {
    loadComments,
    loadFile
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
