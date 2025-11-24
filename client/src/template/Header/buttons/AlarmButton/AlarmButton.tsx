import {Icon} from '@component'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AlarmButton.scss'

type AlarmButtonProps = DivCommonProps & {}

export const AlarmButton: FC<AlarmButtonProps> = ({...props}) => {
  return <Icon iconName="notifications" className={`Alarm_Button`} id="Alarm_Button" {...props} />
}
