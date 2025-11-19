import {useBlogSelector} from '@redux'

import * as F from '../featuresComment'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/CommentInfoGroup.scss'

type CommentInfoGroupProps = DivCommonProps & {comment: LT.CommentTypeLocal}

export const CommentInfoGroup: FC<CommentInfoGroupProps> = ({comment, className, style, ...props}) => {
  const commentOId_delete = useBlogSelector(state => state.comment.commentOId_delete)
  const commentOId_reply = useBlogSelector(state => state.comment.commentOId_reply)

  const isDelModalOpen = commentOId_delete === comment.commentOId
  const isReplyFOpen = commentOId_reply === comment.commentOId

  return (
    <div className={`CommentInfo_Group ${className || ''}`} style={style} {...props}>
      <div className="_commentHeaderContainer">
        <F.CommentUserNameF comment={comment} />
        <F.CommentBtnRowF comment={comment} />

        {isDelModalOpen && <F.CommentDelModalF comment={comment} />}
      </div>
      <F.CommentContentF comment={comment} />
      <F.CommentDateF comment={comment} />

      {isReplyFOpen && <F.CommentNewReplyF comment={comment} />}
    </div>
  )
}
