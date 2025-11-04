import {useCallback} from 'react'
import {useBlogSelector, useCommentActions} from '@redux'
import {CommentUserInfoE} from '../elements'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/CommentUserNameF.scss'

type CommentUserNameFProps = DivCommonProps & {comment: LT.CommentTypeLocal}

export const CommentUserNameF: FC<CommentUserNameFProps> = ({comment, className, style, ...props}) => {
  const commentOId_user = useBlogSelector(state => state.comment.commentOId_user)
  const {setCommentOId_user} = useCommentActions()

  const isUserSelected = commentOId_user === comment.commentOId

  const onClickUserName = useCallback(
    (comment: LT.CommentTypeLocal) => (e: MouseEvent<HTMLParagraphElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setCommentOId_user(comment.commentOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`CommentUserName_F ${className || ''}`} style={style} {...props}>
      <p className="_commentUserName" onClick={onClickUserName(comment)}>
        {comment.userName}
      </p>
      {isUserSelected && <CommentUserInfoE comment={comment} />}
    </div>
  )
}
