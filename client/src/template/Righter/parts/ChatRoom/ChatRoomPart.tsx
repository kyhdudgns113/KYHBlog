import {useCallback} from 'react'

import {useChatActions} from '@redux'

import {CloseRoomButton} from '../../buttons'
import {ChatRoomUserObject, ChatListObject, ChatSubmitObject} from '../../objects'

import type {FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatRoomPart.scss'

type ChatRoomPartProps = DivCommonProps & {}

export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, ...props}) => {
  const {resetChatRoomOId} = useChatActions()

  const onKeyDownChatRoom = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      resetChatRoomOId()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`ChatRoom_Part ${className || ''}`}
      onKeyDown={onKeyDownChatRoom}
      onScroll={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
      tabIndex={0}
      {...props} // ::
    >
      <CloseRoomButton />
      <ChatRoomUserObject />
      <ChatListObject />
      <ChatSubmitObject />
    </div>
  )
}

