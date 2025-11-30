import {useCallback} from 'react'

import {Icon} from '@component'
import {useAlarmActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './AlarmButton.scss'

type AlarmButtonProps = DivCommonProps & {}

export const AlarmButton: FC<AlarmButtonProps> = ({...props}) => {
  const {toggleAlarmObj} = useAlarmActions()

  const onClickAlarmBtn = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleAlarmObj()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Icon iconName="notifications" className={`Alarm_Button`} id="Alarm_Button" onClick={onClickAlarmBtn} {...props} />
}
