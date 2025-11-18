import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './LogInButton.scss'

type LogInButtonProps = DivCommonProps & {}

export const LogInButton: FC<LogInButtonProps> = ({...props}) => {
  return (
    <div className={`LogInButton`} {...props}>
      Log In
    </div>
  )
}
