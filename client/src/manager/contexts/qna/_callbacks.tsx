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

  loadQnA: (qnAOId: string) => Promise<APIReturnType>
  loadQnARowArr: () => Promise<APIReturnType>
  modifyQnA: (qnAOId: string, title: string, content: string, isPrivate: boolean) => Promise<APIReturnType>
}
// prettier-ignore
export const QnACallbacksContext = createContext<ContextType>({
  addQnAFile: async () => ({isSuccess: false}),

  loadQnA: async () => ({isSuccess: false, qnA: NV.NULL_QNA()}),
  loadQnARowArr: async () => ({isSuccess: false, qnARowArr: []}),
  modifyQnA: async () => ({isSuccess: false})
})

export const useQnACallbacksContext = () => useContext(QnACallbacksContext)

export const QnACallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setQnA, setQnARowArr} = useQnAActions()

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
  const loadQnA = useCallback(async (qnAOId: string) => {
    /**
     * 토큰 초기화는 CheckAuth 컴포넌트에서 한다.
     */
    const url = `/client/qna/loadQnA/${qnAOId}`

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
  }, [])

  const loadQnARowArr = useCallback(async () => {
    const url = `/client/qna/loadQnARowArr`
    const NULL_JWT = ''
    return F.get(url, NULL_JWT)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res
        if (ok) {
          setQnARowArr(body.qnARowArr)
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

  // PUT AREA:
  const modifyQnA = useCallback(
    async (qnAOId: string, title: string, content: string, isPrivate: boolean) => {
      const url = `/client/qna/modifyQnA`
      const data: HTTP.ModifyQnAType = {qnAOId, title, content, isPrivate}

      return F.putWithJwt(url, data)
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

    loadQnA,
    loadQnARowArr,
    modifyQnA,
  }
  return <QnACallbacksContext.Provider value={value}>{children}</QnACallbacksContext.Provider>
}
