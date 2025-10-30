import {useAuthStatesContext} from '@context'
import {AddReplyReplyButton, EditReplyButton, DeleteReplyButton} from '../buttons'

import type {FC} from 'react'

import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

import './_styles/ReplyBtnRowF.scss'

type ReplyBtnRowFProps = DivCommonProps & {reply: ReplyType}

export const ReplyBtnRowF: FC<ReplyBtnRowFProps> = ({reply, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()

  return (
    <div className={`ReplyBtnRow_F ${className || ''}`} style={style} {...props}>
      {userOId === reply.userOId && <EditReplyButton reply={reply} />}
      {userOId === reply.userOId && <DeleteReplyButton reply={reply} />}
      <AddReplyReplyButton reply={reply} />
    </div>
  )
}
