import {useCallback} from 'react'

import {useCommentCallbacksContext} from '@context'
import {COMMENT_MAX_LENGTH} from '@shareValue'
import {useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

import './SubmitEditReplyButton.scss'

type SubmitEditReplyButtonProps = ButtonCommonProps & {reply: LT.ReplyTypeLocal; content: string}

export const SubmitEditReplyButton: FC<SubmitEditReplyButtonProps> = ({reply, content, ...props}) => {
  const {editReply} = useCommentCallbacksContext()
  const {resetReplyContent} = useCommentActions()

  const onClickSubmitEditReply = useCallback(
    (reply: LT.ReplyTypeLocal, content: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      /**
       * 이건 폐기한다.
       *   - 관리자도 수정할 수 있다.
       */
      // if (userOId !== comment.userOId) {
      //   alert(`작성자가 아니면 수정할 수 없어요`)
      //   return
      // }

      if (reply.content === content) {
        alert(`수정할 내용이 없어요`)
        return
      }

      if (reply.content.length > COMMENT_MAX_LENGTH) {
        alert(`대댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
        return
      }

      if (content.trim().length === 0) {
        alert(`빈 대댓글은 작성할 수 없습니다.`)
        return
      }

      editReply(reply.replyOId, content) // ::
        .then(isSuccess => {
          if (isSuccess) {
            alert(`대댓글 수정이 완료되었습니다`)
            resetReplyContent()
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className="SubmitEditReply_Button _button_reading_sakura"
      onClick={onClickSubmitEditReply(reply, content)}
      {...props} // ::
    >
      제출
    </button>
  )
}

