import {useEffect, useEffectEvent} from 'react'
import {useBlogSelector} from '@redux'

import {useAuthStatesContext, useUserCallbacksContext} from '@context'
import {AlarmBlockGroup} from '../../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './AlarmListObj.scss'

type AlarmListObjProps = DivCommonProps & {}

export const AlarmListObj: FC<AlarmListObjProps> = ({...props}) => {
  const alarmArr = useBlogSelector(state => state.alarm.alarmArr)
  const {userOId} = useAuthStatesContext()
  const {checkNewAlarm, loadAlarmArr} = useUserCallbacksContext()

  const _loadAlarmArr = useEffectEvent(() => {
    loadAlarmArr(userOId)
  })

  useEffect(() => {
    checkNewAlarm(alarmArr)

    return () => {
      _loadAlarmArr()
    }
  }, [alarmArr])

  return (
    <div className={`AlarmList_Object`} onClick={e => e.stopPropagation()} {...props}>
      {/* 1. 헤더 */}
      <div className={`_header_object`}>
        <div className={`_header_title_object`}>알림</div>
        {alarmArr.length > 0 && (
          <div className={`_header_count_object`}>{alarmArr.filter(alarm => alarm.alarmStatus === SV.ALARM_STATUS_NEW).length}</div>
        )}
      </div>

      {/* 2. 알림 목록 */}
      <div className={`_list_object`}>
        {alarmArr.length === 0 ? (
          <div className={`_empty_object`}>알림이 없습니다.</div>
        ) : (
          alarmArr.map(alarm => <AlarmBlockGroup key={alarm.alarmOId} alarm={alarm} />)
        )}
      </div>
    </div>
  )
}
