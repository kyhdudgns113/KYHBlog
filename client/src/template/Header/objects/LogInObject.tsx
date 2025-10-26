import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_LogIn.scss'

type LogInObjectProps = DivCommonProps & {}

export const LogInObject: FC<LogInObjectProps> = ({className, ...props}) => {
  return (
    <div className={`LogIn_Object ${className || ''}`} {...props}>
      Log In
    </div>
  )
}
