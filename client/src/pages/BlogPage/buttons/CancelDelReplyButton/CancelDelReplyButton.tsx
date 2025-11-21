import {useCallback} from 'react'
import {useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

import './CancelDelReplyButton.scss'

type CancelDelReplyButtonProps = ButtonCommonProps & {}

export const CancelDelReplyButton: FC<CancelDelReplyButtonProps> = ({className, style, ...props}) => {
  const {resetReplyOId_delete} = useCommentActions()

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      resetReplyOId_delete()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelDelReply_Button _button_reading_sakura  ${className || ''}`}
      onClick={onClickDelete}
      style={style}
      {...props} // ::
    >
      취소
    </button>
  )
}

