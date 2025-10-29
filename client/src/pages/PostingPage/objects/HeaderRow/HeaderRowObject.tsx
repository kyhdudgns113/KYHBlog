import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderRowObject.scss'

type HeaderRowObjectProps = DivCommonProps & {}

export const HeaderRowObject: FC<HeaderRowObjectProps> = ({className, ...props}) => {
  return (
    <div className={`HeaderRow_Object ${className || ''}`} {...props}>
      HeaderRowObject
    </div>
  )
}
