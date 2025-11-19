import {useCallback} from 'react'

import {useBlogDispatch, useTemplateActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './LogInButton.scss'

type LogInButtonProps = DivCommonProps & {}

export const LogInButton: FC<LogInButtonProps> = ({...props}) => {
  const {clickLogInBtn} = useTemplateActions()

  const dispatch = useBlogDispatch()

  const onClickLogIn = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      dispatch(clickLogInBtn())
    },
    [dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`LogInButton`} onClick={onClickLogIn} {...props}>
      Log In
    </div>
  )
}
