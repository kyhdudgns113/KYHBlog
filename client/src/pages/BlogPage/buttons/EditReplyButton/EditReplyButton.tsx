import {useCallback} from 'react'
import {useAuthStatesContext} from '@context'
import {useBlogSelector, useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

import './EditReplyButton.scss'

type EditReplyButtonProps = ButtonCommonProps & {reply: LT.ReplyTypeLocal}

/**
 * 대댓글을 수정하는 컴포넌트로 전환하는 버튼이다.
 * - 수정된 대댓글을 서버에 제출하는 버튼은 SubmitEditReplyButton 이다.
 */
export const EditReplyButton: FC<EditReplyButtonProps> = ({reply, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const replyOId_edit = useBlogSelector(state => state.comment.replyOId_edit)
  const {resetReplyOId_edit, setReplyOId_edit} = useCommentActions()

  const onClickEditReply = useCallback(
    (userOId: string, replyOId_edit: string, reply: LT.ReplyTypeLocal) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userOId !== reply.userOId) {
        alert(`작성자가 아니면 수정할 수 없어요`)
        return
      }

      if (replyOId_edit === reply.replyOId) {
        resetReplyOId_edit()
      } // ::
      else {
        setReplyOId_edit(reply.replyOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`EditReply_Button _button_reading ${className || ''}`}
      onClick={onClickEditReply(userOId, replyOId_edit, reply)}
      style={style}
      {...props} // ::
    >
      {replyOId_edit !== reply.replyOId ? '수정' : '취소'}
    </button>
  )
}

