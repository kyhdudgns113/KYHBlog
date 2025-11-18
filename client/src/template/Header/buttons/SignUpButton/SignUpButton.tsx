import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './SignUpButton.scss'

type SignUpButtonProps = DivCommonProps & {}

export const SignUpButton: FC<SignUpButtonProps> = ({...props}) => {
  return (
    <div className={`SignUpButton`} {...props}>
      Sign Up
    </div>
  )
}
