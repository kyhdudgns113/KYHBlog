import {useCallback} from 'react'

import {useCommentCallbacksContext} from '@context'
import {useCommentActions} from '@redux'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

import './_styles/SubmitEditCommentButton.scss'

type SubmitEditCommentButtonProps = ButtonCommonProps & {comment: CommentType; content: string}

export const SubmitEditCommentButton: FC<SubmitEditCommentButtonProps> = ({comment, content, className, style, ...props}) => {
  const {editComment} = useCommentCallbacksContext()
  const {resetCommentContent} = useCommentActions()

  const onClickSubmitEditComment = useCallback(
    (comment: CommentType, content: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      /**
       * 이건 폐기한다.
       *   - 관리자도 수정할 수 있다.
       */
      // if (userOId !== comment.userOId) {
      //   alert(`작성자가 아니면 수정할 수 없어요`)
      //   return
      // }

      if (comment.content === content) {
        alert(`수정할 내용이 없어요`)
        return
      }

      if (comment.content.length > COMMENT_MAX_LENGTH) {
        alert(`댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
        return
      }

      if (content.trim().length === 0) {
        alert(`빈 댓글은 작성할 수 없습니다.`)
        return
      }

      editComment(comment.commentOId, content) // ::
        .then(isSuccess => {
          if (isSuccess) {
            alert(`댓글 수정이 완료되었습니다`)
            resetCommentContent()
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitEditComment_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickSubmitEditComment(comment, content)}
      style={style}
      {...props} // ::
    >
      제출
    </button>
  )
}
