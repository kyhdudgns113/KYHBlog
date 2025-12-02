import {createContext, useCallback, useContext} from 'react'

import {useQnAActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as NV from '@nullValue'
import * as U from '@util'

import type {APIReturnType} from '@type'

// prettier-ignore
type ContextType = {
  addQnAFile: (userOId: string, title: string, content: string, isPrivate: boolean) => Promise<APIReturnType>

  getQnA: (qnAOId: string) => Promise<APIReturnType>
}
// prettier-ignore
export const QnACallbacksContext = createContext<ContextType>({
  addQnAFile: async () => ({isSuccess: false}),

  getQnA: async () => ({isSuccess: false, qnA: NV.NULL_QNA()})
})

export const useQnACallbacksContext = () => useContext(QnACallbacksContext)

export const QnACallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setQnA} = useQnAActions()

  // POST AREA:
  const addQnAFile = useCallback(async (userOId: string, title: string, content: string, isPrivate: boolean) => {
    const url = `/client/qna/addQnAFile`
    const data: HTTP.AddQnAType = {userOId, title, content, isPrivate}

    return F.postWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          const qnAOId = body.qnAOId
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true, qnAOId}
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

  // GET AREA:
  const getQnA = useCallback(
    async (qnAOId: string) => {
      const url = `/client/qna/getQnA/${qnAOId}`

      return F.getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res
          if (ok) {
            setQnA(body.qnA)
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
    [setQnA]
  )

  // prettier-ignore
  const value: ContextType = {
    addQnAFile,

    getQnA,
  }
  return <QnACallbacksContext.Provider value={value}>{children}</QnACallbacksContext.Provider>
}
