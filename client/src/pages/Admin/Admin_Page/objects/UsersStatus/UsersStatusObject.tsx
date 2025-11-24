import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './UsersStatusObject.scss'

type UsersStatusObjectProps = DivCommonProps & {}

export const UsersStatusObject: FC<UsersStatusObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`UsersStatus_Object ${className || ''}`} onClick={e => e.stopPropagation()} style={style} {...props}>
      Users Status Obj
    </div>
  )
}
