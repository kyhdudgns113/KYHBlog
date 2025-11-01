import {useCallback} from 'react'
import {useCommentStates, useCommentActions} from '@redux'
import {ReplyUserInfoE} from '../elements'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/ReplyUserNameF.scss'

type ReplyUserNameFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

export const ReplyUserNameF: FC<ReplyUserNameFProps> = ({reply, className, style, ...props}) => {
  const {replyOId_user} = useCommentStates()
  const {setReplyOId_user} = useCommentActions()

  const isUserSelected = replyOId_user === reply.replyOId

  const onClickUserName = useCallback(
    (reply: LT.ReplyTypeLocal) => (e: MouseEvent<HTMLParagraphElement>) => {
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
