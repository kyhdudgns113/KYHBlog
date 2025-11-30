import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './EmptyPart.scss'

type EmptyPartProps = DivCommonProps & {}

export const EmptyPart: FC<EmptyPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`EmptyPart _admin_part ${className || ''}`} style={style} {...props}>
      <p className={`_part_title`}>Empty</p>
    </div>
  )
}
