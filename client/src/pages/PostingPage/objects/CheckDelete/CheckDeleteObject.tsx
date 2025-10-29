import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './CheckDeleteObject.scss'

type CheckDeleteObjectProps = DivCommonProps & {}

export const CheckDeleteObject: FC<CheckDeleteObjectProps> = ({className, ...props}) => {
  return (
    <div className={`CheckDelete_Object ${className || ''}`} {...props}>
      CheckDeleteObject
    </div>
  )
}
