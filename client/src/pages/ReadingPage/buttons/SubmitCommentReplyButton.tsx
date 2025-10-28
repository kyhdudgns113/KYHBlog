import {useCallback} from 'react'
import {useAuthStatesContext, useCommentCallbacksContext} from '@context'
import {useCommentActions} from '@redux'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {CommentType} from '@shareType'

import * as SV from '@shareValue'

type SubmitCommentReplyButtonProps = ButtonCommonProps & {comment: CommentType; replyContent: string}

/**
 * 댓글의 대댓글을 제출하는 버튼이다.
 */
export const SubmitCommentReplyButton: FC<SubmitCommentReplyButtonProps> = ({comment, replyContent, className, style, ...props}) => {
  const {userAuth, userName, userOId} = useAuthStatesContext()
  const {resetCommentOId_reply} = useCommentActions()
  const {addReply} = useCommentCallbacksContext()

  const onClickSubmit = useCallback(
    (userAuth: number, userOId: string, userName: string, comment: CommentType, replyContent: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (userAuth < SV.AUTH_USER) {
        alert(`권한이 없는 상태거나 로그인을 해야만 합니다.`)
        resetCommentOId_reply()
        return
      }

      if (!replyContent || !replyContent.trim()) {
        alert(`대댓글 내용을 입력해주세요.`)
        return
      }

      if (replyContent.length > COMMENT_MAX_LENGTH) {
        alert(`대댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
        return
      }

      const targetUserOId = comment.userOId
      const targetUserName = comment.userName

      addReply(userOId, userName, targetUserOId, targetUserName, comment.commentOId, replyContent) // ::
        .then(isSuccess => {
          if (isSuccess) {
            resetCommentOId_reply()
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitCommentReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickSubmit(userAuth, userOId, userName, comment, replyContent)}
      style={style}
      {...props} // ::
    >
      확인
    </button>
  )
}
