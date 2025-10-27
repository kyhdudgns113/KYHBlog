import {Icon} from '@component'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

import '../_styles/Btn_Toggle.scss'

type ToggleButtonProps = SpanCommonProps & {}

export const ToggleButton: FC<ToggleButtonProps> = ({className, style, ...props}) => {
  return (
    <Icon
      className={`Toggle_Button _icon ${className || ''}`}
      iconName="menu"
      style={style}
      {...props} // ::
    />
  )
}
