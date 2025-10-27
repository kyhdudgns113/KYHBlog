import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_ChatRoom.scss'

type ChatRoomPartProps = DivCommonProps & {}

export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, ...props}) => {
  return (
    <div className={`ChatRoom_Part ${className || ''}`} {...props}>
      ChatRoomPart
    </div>
  )
}
