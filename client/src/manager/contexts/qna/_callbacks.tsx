import {createContext, useCallback, useContext} from 'react'

import {useQnAActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as U from '@util'

import type {APIReturnType} from '@type'

// prettier-ignore
type ContextType = {
  addQnAFile: (userOId: string, title: string, content: string, isPrivate: boolean) => Promise<APIReturnType>
}
// prettier-ignore
export const QnACallbacksContext = createContext<ContextType>({
  addQnAFile: async () => ({isSuccess: false})
})

export const useQnACallbacksContext = () => useContext(QnACallbacksContext)

export const QnACallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setQnAArr} = useQnAActions()

  // POST AREA:
  const addQnAFile = useCallback(async (userOId: string, title: string, content: string, isPrivate: boolean) => {
    const url = `/client/qna/addQnAFile`
    const data: HTTP.AddQnAType = {userOId, title, content, isPrivate}

    return F.postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setQnAArr(body.qnAArr)
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
  }, [])

  // prettier-ignore
  const value: ContextType = {
    addQnAFile
  }
  return <QnACallbacksContext.Provider value={value}>{children}</QnACallbacksContext.Provider>
}
