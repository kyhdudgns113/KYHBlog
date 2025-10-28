import {useCallback} from 'react'
import {useAuthStatesContext, useCommentCallbacksContext} from '@context'
import {useCommentActions} from '@redux'
import {COMMENT_MAX_LENGTH} from '@shareValue'
import {AUTH_USER} from '@shareValue'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type SubmitReplyReplyButtonProps = ButtonCommonProps & {
  reply: ReplyType
  replyContent: string
}

/**
 * 댓글의 대댓글을 제출하는 버튼이다.
 */
export const SubmitReplyReplyButton: FC<SubmitReplyReplyButtonProps> = ({reply, replyContent, className, style, ...props}) => {
  const {userAuth, userName, userOId} = useAuthStatesContext()
  const {addReply} = useCommentCallbacksContext()
  const {resetReplyOId_reply} = useCommentActions()

  const onClickSubmit = useCallback(
    (userAuth: number, userOId: string, userName: string, reply: ReplyType, replyContent: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (userAuth < AUTH_USER) {
        alert(`권한이 없는 상태거나 로그인을 해야만 합니다.`)
        resetReplyOId_reply()
        return
      }

      if (!replyContent || !replyContent.trim()) {
        alert(`대댓글 내용을 입력해주세요!`)
        return
      }

      if (replyContent.length > COMMENT_MAX_LENGTH) {
        alert(`대댓글은 ${COMMENT_MAX_LENGTH}자 이하 이상으로 작성해주세요.`)
        return
      }

      const targetUserOId = reply.userOId
      const targetUserName = reply.userName

      addReply(userOId, userName, targetUserOId, targetUserName, reply.commentOId, replyContent) // ::
        .then(isSuccess => {
          if (isSuccess) {
            resetReplyOId_reply()
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitReplyReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickSubmit(userAuth, userOId, userName, reply, replyContent)}
      style={style}
      {...props} // ::
    >
      확인
    </button>
  )
}
