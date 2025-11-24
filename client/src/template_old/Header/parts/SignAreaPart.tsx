import {useAuthStatesContext} from '@context'

import {AlarmInfoObject, UserNameObject, LogOutObject, LogInObject, SignUpObject} from '../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_SignArea.scss'

type SignAreaPartProps = DivCommonProps & {}

export const SignAreaPart: FC<SignAreaPartProps> = ({className, ...props}) => {
  const {isLoggedIn} = useAuthStatesContext()

  return (
    <div className={`SignArea_Part ${className || ''}`} {...props}>
      <div className={`_button_row_part`}>
        {isLoggedIn && <AlarmInfoObject />}
        {isLoggedIn && <UserNameObject />}
        {isLoggedIn && <LogOutObject />}
        {!isLoggedIn && <LogInObject />}
        {!isLoggedIn && <SignUpObject />}
      </div>
    </div>
  )
}
