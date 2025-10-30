import {useCallback} from 'react'

import {useCommentCallbacksContext} from '@context'
import {useCommentActions, useCommentStates, useFileStates, useLockActions, useLockStates} from '@redux'
import {AUTH_GUEST, COMMENT_MAX_LENGTH} from '@shareValue'

import * as CT from '@context'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

import './_styles/SubmitCommentButton.scss'

type SubmitCommentButtonProps = ButtonCommonProps

/**
 * 작성된 댓글을 서버에 제출하는 버튼이다.
 */
export const SubmitCommentButton: FC<SubmitCommentButtonProps> = ({className, style, ...props}) => {
  const {userAuth, userName, userOId} = CT.useAuthStatesContext()
  const {fileOId} = useFileStates()
  const {commentContent} = useCommentStates()
  const {setCommentContent} = useCommentActions()
  const {addComment} = useCommentCallbacksContext()
  const {commentLock} = useLockStates()
  const {lockComment, unlockComment} = useLockActions()

  const onClickSubmit = useCallback(
    (userAuth: number, userOId: string, userName: string, fileOId: string, commentContent: string, commentLock: boolean) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (userAuth === AUTH_GUEST) {
          alert(`로그인 이후 이용할 수 있어요`)
          return
        }

        if (commentLock) {
          alert('댓글 등록중이에요')
          return
        }

        if (!commentContent || !commentContent.trim()) {
          return
        }

        if (commentContent.length > COMMENT_MAX_LENGTH) {
          alert(`댓글은 ${COMMENT_MAX_LENGTH}자 이하로 작성해주세요.`)
          return
        }

        lockComment()
        addComment(userOId, userName, fileOId, commentContent)
          .then(() => {
            setCommentContent('')
          })
          .finally(() => {
            unlockComment()
          })
      },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitComment_Button _button_reading ${className || ''}`}
      onClick={onClickSubmit(userAuth, userOId, userName, fileOId, commentContent, commentLock)}
      style={style}
      {...props} // ::
    >
      등록
    </button>
  )
}
