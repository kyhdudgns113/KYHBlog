import {useCommentStates} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import * as F from '../featuresReply'

import './_styles/ReplyInfoGroup.scss'

type ReplyInfoGroupProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

export const ReplyInfoGroup: FC<ReplyInfoGroupProps> = ({reply, className, style, ...props}) => {
  const {replyOId_delete, replyOId_reply} = useCommentStates()

  const isDelModalOpen = replyOId_delete === reply.replyOId
  const isReplyFOpen = replyOId_reply === reply.replyOId

  return (
    <div className={`ReplyInfo_Group ${className || ''}`} style={style} {...props}>
      <div className="_replyHeaderContainer">
        <F.ReplyUserNameF reply={reply} />
        <F.ReplyBtnRowF reply={reply} />

        {isDelModalOpen && <F.ReplyDelModalF reply={reply} />}
      </div>
      <F.ReplyContentF reply={reply} />
      <F.ReplyDateF reply={reply} />

      {isReplyFOpen && <F.ReplyNewReplyF reply={reply} />}
    </div>
  )
}
