import {createContext, useCallback, useContext} from 'react'

import {useAdminActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  loadLogArr: (isAlert: boolean) => Promise<boolean>
  loadUserArr: (isAlert: boolean) => Promise<boolean>
}
// prettier-ignore
export const AdminCallbacksContext = createContext<ContextType>({
  loadLogArr: () => Promise.resolve(false),
  loadUserArr: () => Promise.resolve(false)
})

export const useAdminCallbacksContext = () => useContext(AdminCallbacksContext)

export const AdminCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setLogArr, setUserArr} = useAdminActions()

  const loadLogArr = useCallback(async (isAlert: boolean) => {
    const url = '/client/admin/loadLogArr'
    return F.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setLogArr(body.logArr)
          return true
        } // ::
        else {
          if (isAlert) {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
          return false
        }
      })
      .catch(errObj => {
        if (isAlert) {
          U.alertErrors(url, errObj)
        }
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserArr = useCallback(async (isAlert: boolean) => {
    const url = '/client/admin/loadUserArr'

    return F.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message} = res

        if (ok) {
          setUserArr(body.userArr)
          return true
        } // ::
        else {
          if (isAlert) {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
          return false
        }
      })
      .catch(errObj => {
        if (isAlert) {
          U.alertErrors(url, errObj)
        }
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    loadLogArr,
    loadUserArr
  }
  return <AdminCallbacksContext.Provider value={value}>{children}</AdminCallbacksContext.Provider>
}
