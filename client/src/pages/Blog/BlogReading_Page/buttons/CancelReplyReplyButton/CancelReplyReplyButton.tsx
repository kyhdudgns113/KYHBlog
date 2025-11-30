import {useCallback} from 'react'
import {useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

import './CancelReplyReplyButton.scss'

type CancelReplyReplyButtonProps = ButtonCommonProps & {}

export const CancelReplyReplyButton: FC<CancelReplyReplyButtonProps> = ({...props}) => {
  const {resetReplyOId_reply} = useCommentActions()

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      resetReplyOId_reply()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelReplyReply_Button _button_reading_sakura`}
      onClick={onClickCancel}
      {...props} // ::
    >
      취소
    </button>
  )
}

