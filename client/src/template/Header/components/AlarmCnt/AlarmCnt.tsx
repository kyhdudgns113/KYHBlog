import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './AlarmCnt.scss'

type AlarmCntProps = DivCommonProps & {}

export const AlarmCnt: FC<AlarmCntProps> = ({...props}) => {
  const alarmArr = useBlogSelector(state => state.alarm.alarmArr)
  const newAlarmCount = alarmArr.filter(alarm => alarm.alarmStatus === SV.ALARM_STATUS_NEW).length

  if (newAlarmCount === 0) {
    return null
  }

  return (
    <div className={`Alarm_Cnt`} {...props}>
      {newAlarmCount}
    </div>
  )
}
