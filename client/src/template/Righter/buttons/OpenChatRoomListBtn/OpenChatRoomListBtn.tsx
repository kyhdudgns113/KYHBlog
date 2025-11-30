import {useCallback} from 'react'

import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import * as T from '@type'

import './OpenChatRoomListBtn.scss'

type OpenChatRoomListBtnProps = SpanCommonProps & {
  closePart: () => void
  isOpen: boolean
  openPart: (which: T.HeaderBtnClickedType | 'chatRoomList') => void
}

export const OpenChatRoomListBtn: FC<OpenChatRoomListBtnProps> = ({closePart, isOpen, openPart, className, ...props}) => {
  const onClickOpenChatRoomList = useCallback(
    (isOpen: boolean) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (isOpen) {
        closePart()
      } // ::
      else {
        openPart('chatRoomList')
      }
    },
    [closePart, openPart]
  )

  return (
    <Icon
      className={`OpenChatRoomList_Btn _icon ${className || ''}`}
      iconName="forum"
      onClick={onClickOpenChatRoomList(isOpen)}
      {...props} // ::
    />
  )
}
