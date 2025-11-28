import {createContext, useCallback, useContext} from 'react'

import {useAlarmActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as HTTP from '@httpType'
import * as LT from '@localizeType'
import * as T from '@type'
import * as U from '@util'
import * as SV from '@shareValue'

// prettier-ignore
type ContextType = {
  checkNewAlarm: (alarmArr: LT.AlarmTypeLocal[]) => void

  loadUserInfo: (userOId: string, setTargetUser: T.Setter<LT.UserTypeLocal>) => Promise<boolean>
}
// prettier-ignore
export const UserCallbacksContext = createContext<ContextType>({
  checkNewAlarm: () => {},

  loadUserInfo: () => Promise.resolve(false)
})

export const useUserCallbacksContext = () => useContext(UserCallbacksContext)

export const UserCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setAlarmArr} = useAlarmActions()

  // PUT AREA:
  const checkNewAlarm = useCallback(async (alarmArr: LT.AlarmTypeLocal[]) => {
    const checkedAlarmArr = alarmArr
      .filter(alarm => alarm.alarmStatus === SV.ALARM_STATUS_NEW)
      .map(alarm => {
        const {createdAtValue, ...rest} = alarm
        return {
          ...rest,
          createdAt: new Date(createdAtValue)
        }
      })

    if (checkedAlarmArr.length === 0) return

    const url = `/client/user/checkNewAlarm`
    const data: HTTP.CheckNewAlarmType = {checkedAlarmArr}

    return F.putWithJwt(url, data)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          if (body.alarmArr) {
            setAlarmArr(body.alarmArr)
          }
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // GET AREA:
  const loadUserInfo = useCallback(async (userOId: string, setTargetUser: T.Setter<LT.UserTypeLocal>) => {
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
    checkNewAlarm,
    
    loadUserInfo
  }
  return <UserCallbacksContext.Provider value={value}>{children}</UserCallbacksContext.Provider>
}
