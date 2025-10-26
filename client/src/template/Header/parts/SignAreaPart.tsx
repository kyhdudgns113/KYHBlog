import {AlarmInfoObject, UserNameObject, LogOutObject, LogInObject, SignUpObject} from '../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_SignArea.scss'

type SignAreaPartProps = DivCommonProps & {}

export const SignAreaPart: FC<SignAreaPartProps> = ({className, ...props}) => {
  return (
    <div className={`SignArea_Part ${className || ''}`} {...props}>
      <div className="_button_row_part">
        <AlarmInfoObject />
        <UserNameObject />
        <LogOutObject />
        <LogInObject />
        <SignUpObject />
      </div>
    </div>
  )
}
