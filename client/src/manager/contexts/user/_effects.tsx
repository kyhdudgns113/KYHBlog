import {createContext, useContext, useEffect} from 'react'

import {useAlarmActions} from '@redux'

import {useAuthStatesContext} from '../auth'
import {useSocketCallbacksContext, useSocketStatesContext} from '../socket'
import {useUserCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

import * as SCK from '@socketType'
import * as ST from '@shareType'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const UserEffectsContext = createContext<ContextType>({})

export const useUserEffectsContext = () => useContext(UserEffectsContext)

export const UserEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {deleteFromAlarmArr, pushFrontAlarmArr} = useAlarmActions()

  const {socket} = useSocketStatesContext()
  const {userOId} = useAuthStatesContext()

  const {onSocket} = useSocketCallbacksContext()
  const {loadAlarmArr} = useUserCallbacksContext()

  // 초기화: alarmArr 불러오기
  useEffect(() => {
    if (userOId) {
      loadAlarmArr(userOId)
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 소켓 수신: 새 알람 올 때
  useEffect(() => {
    if (socket) {
      onSocket(socket, 'new alarm', (payload: SCK.NewAlarmType) => {
        const {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, qnAOId, senderUserName, senderUserOId, userOId} = payload
        const newAlarm: ST.AlarmType = {alarmOId, alarmStatus, alarmType, content, createdAt, fileOId, qnAOId, senderUserName, senderUserOId, userOId}

        pushFrontAlarmArr(newAlarm)
      })

      onSocket(socket, 'remove alarm', (payload: SCK.UserAlarmRemovedType) => {
        const {alarmOId} = payload
        deleteFromAlarmArr(alarmOId)
      })
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps
  return <UserEffectsContext.Provider value={{}}>{children}</UserEffectsContext.Provider>
}
