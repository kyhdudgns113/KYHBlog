import {useCallback} from 'react'
import {Icon} from '@component'
import {useTemplateActions, useTemplateStates} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './ToggleButton.scss'

type ToggleButtonProps = SpanCommonProps & {}

export const ToggleButton: FC<ToggleButtonProps> = ({className, style, ...props}) => {
  const {isRighterOpen} = useTemplateStates()
  const {toggleRighter} = useTemplateActions()

  const onClickRToggle = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      toggleRighter()
    },
    [toggleRighter]
  )

  return (
    <Icon
      className={`Toggle_Button _icon ${isRighterOpen ? '_open' : '_close'} ${className || ''}`}
      iconName="menu"
      onClick={onClickRToggle}
      style={style}
      {...props} // ::
    />
  )
}
