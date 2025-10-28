import {CancelDelReplyButton, SubmitDelReplyButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

import './_styles/ReplyDelModalF.scss'

type ReplyDelModalFProps = DivCommonProps & {reply: ReplyType}
export const ReplyDelModalF: FC<ReplyDelModalFProps> = ({reply, className, style, ...props}) => {
  return (
    <div
      className={`ReplyDelModal_F ${reply.replyOId} ${className || ''}`}
      onClick={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      {/* 1. Title */}
      <p className="__title">삭제할까요?</p>

      {/* 2. Button Row: 삭제, 취소 */}
      <div className="_replyDelModalBtnRow">
        <SubmitDelReplyButton reply={reply} />
        <CancelDelReplyButton />
      </div>
    </div>
  )
}
