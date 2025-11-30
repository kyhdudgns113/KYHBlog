import {useBlogSelector} from '@redux'

import {ChatRoomRowObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatRoomListPart.scss'

type ChatRoomListPartProps = DivCommonProps & {}

export const ChatRoomListPart: FC<ChatRoomListPartProps> = ({className, ...props}) => {
  const chatRoomArr = useBlogSelector(state => state.chat.chatRoomArr)

  return (
    <div
      className={`ChatRoomList_Part SCROLL_GREY ${className || ''}`}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      {...props} // ::
    >
      {chatRoomArr.map(chatRoom => (
        <ChatRoomRowObject key={chatRoom.chatRoomOId} chatRoom={chatRoom} />
      ))}
    </div>
  )
}
