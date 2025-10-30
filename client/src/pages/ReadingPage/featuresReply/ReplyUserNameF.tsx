import {useCallback} from 'react'
import {useCommentStates, useCommentActions} from '@redux'
import {ReplyUserInfoE} from '../elements'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

import './_styles/ReplyUserNameF.scss'

type ReplyUserNameFProps = DivCommonProps & {reply: ReplyType}

export const ReplyUserNameF: FC<ReplyUserNameFProps> = ({reply, className, style, ...props}) => {
  const {replyOId_user} = useCommentStates()
  const {setReplyOId_user} = useCommentActions()

  const isUserSelected = replyOId_user === reply.replyOId

  const onClickUserName = useCallback(
    (reply: ReplyType) => (e: MouseEvent<HTMLParagraphElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setReplyOId_user(reply.replyOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`ReplyUserName_F ${className || ''}`} style={style} {...props}>
      <p className="_replyUserName" onClick={onClickUserName(reply)}>
        {reply.userName}
      </p>
      {isUserSelected && <ReplyUserInfoE reply={reply} />}
    </div>
  )
}
