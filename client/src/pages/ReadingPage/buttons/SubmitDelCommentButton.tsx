import {useCallback} from 'react'
import {useAuthStatesContext, useCommentCallbacksContext} from '@context'
import {AUTH_ADMIN} from '@secret'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

type SubmitDelCommentButtonProps = ButtonCommonProps & {comment: CommentType}

export const SubmitDelCommentButton: FC<SubmitDelCommentButtonProps> = ({comment, className, style, ...props}) => {
  const {userAuth, userOId} = useAuthStatesContext()
  const {deleteComment} = useCommentCallbacksContext()

  const onClickDelete = useCallback(
    (userAuth: number, userOId: string, comment: CommentType) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      /**
       * 이건 폐기한다.
       *   - 관리자도 삭제  할 수 있다.
       */
      if (userOId !== comment.userOId && userAuth !== AUTH_ADMIN) {
        alert(`작성자가 아니면 수정할 수 없어요`)
        return
      }

      deleteComment(comment.commentOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitDelComment_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickDelete(userAuth, userOId, comment)}
      style={style}
      {...props} // ::
    >
      확인
    </button>
  )
}
