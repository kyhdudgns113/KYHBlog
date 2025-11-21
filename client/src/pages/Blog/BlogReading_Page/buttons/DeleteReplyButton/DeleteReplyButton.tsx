import {useCallback} from 'react'
import {useBlogSelector, useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

import './DeleteReplyButton.scss'

type DeleteReplyButtonProps = ButtonCommonProps & {reply: LT.ReplyTypeLocal}

/**
 * 대댓글을 삭제할지 물어보는 모달을 띄우는 버튼이다.
 * - 실제 삭제는 SubmitDeleteReplyButton 이다.
 */
export const DeleteReplyButton: FC<DeleteReplyButtonProps> = ({reply, ...props}) => {
  const replyOId_delete = useBlogSelector(state => state.comment.replyOId_delete)
  const {resetReplyOId_delete, setReplyOId_delete} = useCommentActions()

  const onClickDeleteReply = useCallback(
    (reply: LT.ReplyTypeLocal, replyOId_delete: string) => (e: MouseEvent<HTMLButtonElement>) => {
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

      if (replyOId_delete === reply.replyOId) {
        resetReplyOId_delete()
      } // ::
      else {
        setReplyOId_delete(reply.replyOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className="DeleteReply_Button _button_reading"
      onClick={onClickDeleteReply(reply, replyOId_delete)}
      {...props} // ::
    >
      삭제
    </button>
  )
}

