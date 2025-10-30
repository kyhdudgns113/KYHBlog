import {useCallback} from 'react'
import {useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type CancelCommentReplyButtonProps = ButtonCommonProps & {}

export const CancelCommentReplyButton: FC<CancelCommentReplyButtonProps> = ({className, style, ...props}) => {
  const {resetCommentOId_reply} = useCommentActions()
  const {resetReplyOId_delete, resetReplyOId_edit, resetReplyOId_reply} = useCommentActions()

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      resetCommentOId_reply()
      resetReplyOId_delete()
      resetReplyOId_edit()
      resetReplyOId_reply()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelCommentReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickCancel}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}
