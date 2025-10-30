import {useChatStates} from '@redux'

import {ChatRoomRowObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatRoomListPart.scss'

type ChatRoomListPartProps = DivCommonProps & {}

export const ChatRoomListPart: FC<ChatRoomListPartProps> = ({className, ...props}) => {
  const {chatRoomArr} = useChatStates()

  return (
    <div
      className={`ChatRoomList_Part ${className || ''}`}
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
