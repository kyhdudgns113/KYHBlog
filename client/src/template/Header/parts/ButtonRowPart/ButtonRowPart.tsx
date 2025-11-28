import {useAuthStatesContext} from '@context'

import {useBlogSelector} from '@redux'

import {AdminButton, AlarmButton, LogInButton, LogOutButton, SignUpButton, UserNameButton} from '../../buttons'
import {AlarmListObj} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './ButtonRowPart.scss'

type ButtonRowPartProps = DivCommonProps & {}

export const ButtonRowPart: FC<ButtonRowPartProps> = ({...props}) => {
  const {isLoggedIn, userAuth} = useAuthStatesContext()

  const isAlarmObjOpen = useBlogSelector(state => state.alarm.isAlarmObjOpen)

  return (
    <div className={`ButtonRow_Part`} {...props}>
      {/* 1. 로그인 상태시 표시되는 컴포넌트들 */}
      {isLoggedIn && (
        <div className={`wrapper_part`}>
          {/* 1-1. 관리자 버튼 */}
          {userAuth === SV.AUTH_ADMIN && <AdminButton />}

          {/* 1-2. 알람 영역 */}
          <div className="alarm_wrapper_part">
            <AlarmButton />
            {isAlarmObjOpen && <AlarmListObj />}
          </div>

          {/* 1-3. 사용자 이름 버튼 */}
          <UserNameButton />

          {/* 1-4. 로그아웃 버튼 */}
          <LogOutButton />
        </div>
      )}

      {/* 2. 로그아웃 상태시 표시되는 컴포넌트들 */}
      {!isLoggedIn && (
        <div className={`wrapper_part`}>
          <LogInButton />
          <SignUpButton />
        </div>
      )}
    </div>
  )
}
