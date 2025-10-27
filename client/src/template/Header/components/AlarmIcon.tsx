import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Cmp_AlarmIcon.scss'

type AlarmIconProps = DivCommonProps & {}
export const AlarmIcon: FC<AlarmIconProps> = ({className, style, ...props}) => {
  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    alert('알람이 클릭되었어요')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Icon
      className={`Alarm_Icon ${className || ''}`}
      iconName="notifications"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
