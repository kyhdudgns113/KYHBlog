import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_UserName.scss'

type UserNameObjectProps = DivCommonProps & {}

export const UserNameObject: FC<UserNameObjectProps> = ({className, ...props}) => {
  return (
    <div className={`UserName_Object ${className || ''}`} {...props}>
      UserNameObject
    </div>
  )
}
