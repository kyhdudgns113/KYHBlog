import {useCallback} from 'react'
import {useCommentActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

import './CancelDelCommentButton.scss'

type CancelDelCommentButtonProps = ButtonCommonProps & {}

export const CancelDelCommentButton: FC<CancelDelCommentButtonProps> = ({...props}) => {
  const {resetCommentOId_delete} = useCommentActions()

  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      resetCommentOId_delete()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`CancelDelComment_Button _button_reading_sakura`}
      onClick={onClickDelete}
      {...props} // ::
    >
      취소
    </button>
  )
}

