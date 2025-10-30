import {createContext, useCallback, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as ST from '@shareType'
import * as T from '@type'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  loadUserInfo: (userOId: string, setTargetUser: T.Setter<ST.UserType>) => Promise<boolean>
}
// prettier-ignore
export const UserCallbacksContext = createContext<ContextType>({
  loadUserInfo: () => Promise.resolve(false)
})

export const useUserCallbacksContext = () => useContext(UserCallbacksContext)

export const UserCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const loadUserInfo = useCallback(async (userOId: string, setTargetUser: T.Setter<ST.UserType>) => {
    const url = `/client/user/loadUserInfo/${userOId}`
    const NULL_JWT = ''

    return F.get(url, NULL_JWT)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setTargetUser(body.user)
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

  // prettier-ignore
  const value: ContextType = {
    loadUserInfo
  }
  return <UserCallbacksContext.Provider value={value}>{children}</UserCallbacksContext.Provider>
}
