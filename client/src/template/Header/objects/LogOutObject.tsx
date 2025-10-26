import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_LogOut.scss'

type LogOutObjectProps = DivCommonProps & {}

export const LogOutObject: FC<LogOutObjectProps> = ({className, ...props}) => {
  return (
    <div className={`LogOut_Object ${className || ''}`} {...props}>
      LogOutObject
    </div>
  )
}
