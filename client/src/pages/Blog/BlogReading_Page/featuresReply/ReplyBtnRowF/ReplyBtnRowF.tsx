import {useAuthStatesContext} from '@context'
import {AddReplyReplyButton, EditReplyButton, DeleteReplyButton} from '../../buttons'

import type {FC} from 'react'

import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './ReplyBtnRowF.scss'

type ReplyBtnRowFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

export const ReplyBtnRowF: FC<ReplyBtnRowFProps> = ({reply, ...props}) => {
  const {userOId} = useAuthStatesContext()

  return (
    <div className={`ReplyBtnRow_F`} {...props}>
      {userOId === reply.userOId && <EditReplyButton reply={reply} />}
      {userOId === reply.userOId && <DeleteReplyButton reply={reply} />}
      <AddReplyReplyButton reply={reply} />
    </div>
  )
}

