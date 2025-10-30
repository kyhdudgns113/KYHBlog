import {useCallback} from 'react'

import {useAuthStatesContext} from '@context'
import {useCommentActions} from '@redux'
import {AUTH_GUEST} from '@shareValue'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

type AddReplyReplyButtonProps = ButtonCommonProps & {reply: ReplyType}

/**
 * 대댓글에 대댓글을 작성하는 컴포넌트를 띄우는 버튼이다.
 * - 제출하는 버튼은 SubmitReplyButton 이다.
 */
export const AddReplyReplyButton: FC<AddReplyReplyButtonProps> = ({reply, className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {setReplyOId_reply} = useCommentActions()

  const onClickAddReply = useCallback(
    (userAuth: number, reply: ReplyType) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userAuth === AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        return
      }

      setReplyOId_reply(reply.replyOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`AddReplyReply_Button _button_reading ${className || ''}`}
      onClick={onClickAddReply(userAuth, reply)}
      style={style}
      {...props} // ::
    >
      댓글
    </button>
  )
}
