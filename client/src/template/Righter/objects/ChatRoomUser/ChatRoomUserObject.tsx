import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import {useChatStates} from '@redux'

import './ChatRoomUserObject.scss'

type ChatRoomUserObjectProps = DivCommonProps & {}

export const ChatRoomUserObject: FC<ChatRoomUserObjectProps> = ({className, style, ...props}) => {
  const {chatRoom} = useChatStates()

  return (
    <div className={`ChatRoomUser_Object ${className || ''}`} style={style} {...props}>
      <div className="_name_id">
        <p className="_name">{chatRoom.targetUserName}</p>
        <p className="_id">{`(${chatRoom.targetUserId})`}</p>
      </div>
      <p className="_mail">{chatRoom.targetUserMail}</p>
    </div>
  )
}
