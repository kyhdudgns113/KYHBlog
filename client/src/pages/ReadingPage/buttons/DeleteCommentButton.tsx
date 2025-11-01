import {useCallback} from 'react'
import {useCommentActions, useCommentStates} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

type DeleteCommentButtonProps = ButtonCommonProps & {comment: LT.CommentTypeLocal}

/**
 * 댓글을 삭제할지 물어보는 모달을 띄우는 버튼이다.
 * - 실제 삭제는 SubmitDeleteCommentButton 이다.
 */
export const DeleteCommentButton: FC<DeleteCommentButtonProps> = ({comment, className, style, ...props}) => {
  const {commentOId_delete} = useCommentStates()
  const {resetCommentOId_delete, setCommentOId_delete} = useCommentActions()

  const onClickDeleteComment = useCallback(
    (comment: LT.CommentTypeLocal, commentOId_delete: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      /**
       * 이건 폐기한다
       *   - 관리자도 삭제할 수 있다.
       */
      // if (userOId !== comment.userOId) {
      //   alert(`작성자가 아니면 삭제할 수 없어요`)
      //   return
      // }

      if (commentOId_delete === comment.commentOId) {
        resetCommentOId_delete()
      } // ::
      else {
        setCommentOId_delete(comment.commentOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`DeleteComment_Button _button_reading ${className || ''}`}
      onClick={onClickDeleteComment(comment, commentOId_delete)}
      style={style}
      {...props} // ::
    >
      삭제
    </button>
  )
}
