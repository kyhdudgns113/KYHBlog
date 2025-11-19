import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './LogInPart.scss'

type LogInPartProps = DivCommonProps & {}

export const LogInPart: FC<LogInPartProps> = ({className, ...props}) => {
  return (
    <div className={`LogIn_Part ${className || ''}`} {...props}>
      LogInPart
    </div>
  )
}
