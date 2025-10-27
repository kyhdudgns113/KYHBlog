import {useCallback} from 'react'

import {Icon} from '@component'
import {useTemplateActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import '../_styles/Btn_Toggle.scss'

type ToggleButtonProps = SpanCommonProps & {}

export const ToggleButton: FC<ToggleButtonProps> = ({className, style, ...props}) => {
  const {toggleLefter} = useTemplateActions()

  const onClickLToggle = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      toggleLefter()
    },
    [toggleLefter]
  )

  return (
    <Icon
      className={`Toggle_Button _icon ${className || ''}`}
      iconName="menu"
      onClick={onClickLToggle}
      style={style}
      {...props} // ::
    />
  )
}
