import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './ChatBlockMyGroup.scss'

type ChatBlockMyGroupProps = DivCommonProps & {chat: LT.ChatTypeLocal; isSameArea: boolean}

export const ChatBlockMyGroup: FC<ChatBlockMyGroupProps> = ({chat, isSameArea, className, style, ...props}) => {
  return (
    <div className={`ChatBlockMy_Group ${isSameArea ? '_sameArea' : ''} ${className || ''}`} style={style} {...props}>
      <div className="_chatBlock">
        <div className="_content">{`${chat.content}`}</div>
      </div>
    </div>
  )
}
