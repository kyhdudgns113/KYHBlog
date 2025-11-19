import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './LogInPart.scss'

type LogInPartProps = DivCommonProps & {}

export const LogInPart: FC<LogInPartProps> = ({...props}) => {
  return (
    <div className={`LogIn_Part`} {...props}>
      LogInPart
    </div>
  )
}

