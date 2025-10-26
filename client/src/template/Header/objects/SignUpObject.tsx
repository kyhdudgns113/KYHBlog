import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_SignUp.scss'

type SignUpObjectProps = DivCommonProps & {}

export const SignUpObject: FC<SignUpObjectProps> = ({className, ...props}) => {
  return (
    <div className={`SignUp_Object ${className || ''}`} {...props}>
      Sign Up
    </div>
  )
}
