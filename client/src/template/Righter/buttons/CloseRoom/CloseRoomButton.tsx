import {useCallback} from 'react'
import {Icon} from '@component'
import {useChatActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './CloseRoomButton.scss'

type CloseRoomButtonProps = SpanCommonProps & {}

export const CloseRoomButton: FC<CloseRoomButtonProps> = ({className, style, ...props}) => {
  const {resetChatRoomOId} = useChatActions()

  const onClickIcon = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      resetChatRoomOId()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Icon
      iconName="close"
      className={`CloseRoom_Button ${className || ''}`}
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
