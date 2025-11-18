import {useCallback} from 'react'

import {useAuthCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './LogOutButton.scss'

type LogOutButtonProps = DivCommonProps & {}

export const LogOutButton: FC<LogOutButtonProps> = ({...props}) => {
  const {logOut} = useAuthCallbacksContext()

  const onClickLogOut = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    logOut()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`LogOutButton`} onClick={onClickLogOut} {...props}>
      Log Out
    </div>
  )
}
