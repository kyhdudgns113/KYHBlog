import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './SignUpPart.scss'

type SignUpPartProps = DivCommonProps & {}

export const SignUpPart: FC<SignUpPartProps> = ({className, ...props}) => {
  return (
    <div className={`SignUp_Part ${className || ''}`} {...props}>
      SignUpPart
    </div>
  )
}
