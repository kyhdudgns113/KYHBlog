import {useAuthStatesContext} from '@context'
import {AddCommentReplyButton, EditCommentButton, DeleteCommentButton} from '../buttons'

import type {FC} from 'react'

import type {DivCommonProps} from '@prop'
import type {CommentType} from '@shareType'

import './_styles/CommentBtnRowF.scss'

type CommentBtnRowFProps = DivCommonProps & {comment: CommentType}

export const CommentBtnRowF: FC<CommentBtnRowFProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()

  return (
    <div className={`CommentBtnRow_F ${className || ''}`} style={style} {...props}>
      {userOId === comment.userOId && <EditCommentButton comment={comment} />}
      {userOId === comment.userOId && <DeleteCommentButton comment={comment} />}
      <AddCommentReplyButton comment={comment} />
    </div>
  )
}
