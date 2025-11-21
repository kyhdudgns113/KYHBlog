import {useCallback} from 'react'
import {useAuthStatesContext} from '@context'
import {useBlogSelector, useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

import './EditCommentButton.scss'

type EditCommentButtonProps = ButtonCommonProps & {comment: LT.CommentTypeLocal}

/**
 * 댓글을 수정하는 컴포넌트로 전환하는 버튼이다.
 * - 수정된 댓글을 서버에 제출하는 버튼은 SubmitEditCommentButton 이다.
 */
export const EditCommentButton: FC<EditCommentButtonProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const commentOId_edit = useBlogSelector(state => state.comment.commentOId_edit)
  const {resetCommentOId_edit, setCommentOId_edit} = useCommentActions()

  const onClickEditComment = useCallback(
    (userOId: string, commentOId_edit: string, comment: LT.CommentTypeLocal) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userOId !== comment.userOId) {
        alert(`작성자가 아니면 수정할 수 없어요`)
        return
      }

      if (commentOId_edit === comment.commentOId) {
        resetCommentOId_edit()
      } // ::
      else {
        setCommentOId_edit(comment.commentOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`EditComment_Button _button_reading ${className || ''}`}
      onClick={onClickEditComment(userOId, commentOId_edit, comment)}
      style={style}
      {...props} // ::
    >
      {commentOId_edit !== comment.commentOId ? '수정' : '취소'}
    </button>
  )
}

