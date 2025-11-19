import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './SignUpPart.scss'

type SignUpPartProps = DivCommonProps & {}

export const SignUpPart: FC<SignUpPartProps> = ({...props}) => {
  return (
    <div className={`SignUp_Part`} {...props}>
      SignUpPart
    </div>
  )
}

