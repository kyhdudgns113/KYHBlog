import {CancelDelReplyButton, SubmitDelReplyButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './ReplyDelModalF.scss'

type ReplyDelModalFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}
export const ReplyDelModalF: FC<ReplyDelModalFProps> = ({reply, ...props}) => {
  return (
    <div
      className={`ReplyDelModal_F ${reply.replyOId}`}
      onClick={e => e.stopPropagation()}
      {...props} // ::
    >
      {/* 1. Title */}
      <p className={`__title`}>삭제할까요?</p>

      {/* 2. Button Row: 삭제, 취소 */}
      <div className={`_replyDelModalBtnRow`}>
        <SubmitDelReplyButton reply={reply} />
        <CancelDelReplyButton />
      </div>
    </div>
  )
}

