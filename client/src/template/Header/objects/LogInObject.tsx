import {useCallback} from 'react'
import {useModalActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_LogIn.scss'

type LogInObjectProps = DivCommonProps & {}

export const LogInObject: FC<LogInObjectProps> = ({className, ...props}) => {
  const {openLogInModal} = useModalActions()

  const onClickLogIn = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      openLogInModal()
    },
    [openLogInModal]
  )

  return (
    <div className={`LogIn_Object ${className || ''}`} onClick={onClickLogIn} {...props}>
      Log In
    </div>
  )
}
