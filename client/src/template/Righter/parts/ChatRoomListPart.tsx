import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_ChatRoomList.scss'

type ChatRoomListPartProps = DivCommonProps & {}

export const ChatRoomListPart: FC<ChatRoomListPartProps> = ({className, ...props}) => {
  return (
    <div className={`ChatRoomList_Part ${className || ''}`} {...props}>
      ChatRoomListPart
    </div>
  )
}
