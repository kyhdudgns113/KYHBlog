import {useAuthStatesContext} from '@context'

import {AlarmButton, LogInButton, LogOutButton, SignUpButton, UserNameButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ButtonRowPart.scss'

type ButtonRowPartProps = DivCommonProps & {}

export const ButtonRowPart: FC<ButtonRowPartProps> = ({...props}) => {
  const {isLoggedIn} = useAuthStatesContext()

  return (
    <div className={`ButtonRow_Part`} {...props}>
      {/* 1. 로그인 상태시 표시되는 컴포넌트들 */}
      {isLoggedIn && (
        <div className="wrapper_part">
          <AlarmButton />
          <UserNameButton />
          <LogOutButton />
        </div>
      )}

      {/* 2. 로그아웃 상태시 표시되는 컴포넌트들 */}
      {!isLoggedIn && (
        <div className="wrapper_part">
          <LogInButton />
          <SignUpButton />
        </div>
      )}
    </div>
  )
}
