import {useCallback} from 'react'

import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './SettingButton.scss'

type SettingButtonProps = SpanCommonProps & {}

export const SettingButton: FC<SettingButtonProps> = ({className, ...props}) => {
  const onClickSetting = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()

    alert('이 버튼은 장식용이에요')
  }, [])

  return (
    <Icon
      className={`Setting_Button _icon ${className || ''}`}
      iconName="settings"
      onClick={onClickSetting}
      {...props} // ::
    />
  )
}
