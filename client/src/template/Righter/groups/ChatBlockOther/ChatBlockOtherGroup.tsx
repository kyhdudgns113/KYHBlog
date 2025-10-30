import {Icon} from '@component'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {ChatType} from '@shareType'

import './ChatBlockOtherGroup.scss'

type ChatBlockOtherGroupProps = DivCommonProps & {chat: ChatType; isSameArea: boolean}

export const ChatBlockOtherGroup: FC<ChatBlockOtherGroupProps> = ({chat, isSameArea, className, style, ...props}) => {
  return (
    <div className={`ChatBlockOther_Group ${className || ''}`} style={style} {...props}>
      <div className="_profile">{isSameArea ? ' ' : <Icon className="_icon" iconName="person" />}</div>
      <div className="_chatBlock">
        {!isSameArea && <div className="_userName">{chat.userName}</div>}
        <div className="_content">{`${chat.content}`}</div>
      </div>
    </div>
  )
}
