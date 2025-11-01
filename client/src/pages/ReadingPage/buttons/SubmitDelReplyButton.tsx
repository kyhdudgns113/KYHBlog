import {useCallback} from 'react'
import {useAuthStatesContext, useCommentCallbacksContext} from '@context'
import {AUTH_ADMIN} from '@secret'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'

type SubmitDelReplyButtonProps = ButtonCommonProps & {reply: LT.ReplyTypeLocal}

export const SubmitDelReplyButton: FC<SubmitDelReplyButtonProps> = ({reply, className, style, ...props}) => {
  const {userAuth, userOId} = useAuthStatesContext()
  const {deleteReply} = useCommentCallbacksContext()

  const onClickDelete = useCallback(
    (userAuth: number, userOId: string, reply: LT.ReplyTypeLocal) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      /**
       * 이건 폐기한다.
       *   - 관리자도 삭제  할 수 있다.
       */
      if (userOId !== reply.userOId && userAuth !== AUTH_ADMIN) {
        alert(`작성자가 아니면 수정할 수 없어요`)
        return
      }

      deleteReply(reply.replyOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`SubmitDelReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickDelete(userAuth, userOId, reply)}
      style={style}
      {...props} // ::
    >
      확인
    </button>
  )
}
