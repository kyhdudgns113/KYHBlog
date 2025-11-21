import {useCallback} from 'react'
import {useBlogSelector, useCommentActions} from '@redux'
import {ReplyUserInfoE} from '../../elements'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './ReplyUserNameF.scss'

type ReplyUserNameFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

export const ReplyUserNameF: FC<ReplyUserNameFProps> = ({reply, ...props}) => {
  const replyOId_user = useBlogSelector(state => state.comment.replyOId_user)
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
    <div className="ReplyUserName_F" {...props}>
      <p className="_replyUserName" onClick={onClickUserName(reply)}>
        {reply.userName}
      </p>
      {isUserSelected && <ReplyUserInfoE reply={reply} />}
    </div>
  )
}

