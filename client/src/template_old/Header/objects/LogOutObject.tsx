import {useCallback} from 'react'

import {useAuthCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_LogOut.scss'

type LogOutObjectProps = DivCommonProps & {}

export const LogOutObject: FC<LogOutObjectProps> = ({className, ...props}) => {
  const {logOut} = useAuthCallbacksContext()

  const onClickLogOut = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      logOut()
    },
    [logOut]
  )

  return (
    <div className={`LogOut_Object ${className || ''}`} onClick={onClickLogOut} {...props}>
      Log Out
    </div>
  )
}
