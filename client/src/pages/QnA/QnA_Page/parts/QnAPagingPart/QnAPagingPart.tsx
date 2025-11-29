import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAPagingPart.scss'

type QnAPagingPartProps = DivCommonProps & {}

export const QnAPagingPart: FC<QnAPagingPartProps> = ({className, ...props}) => {
  return (
    <div className={`QnAPaging_Part ${className || ''}`} {...props}>
      {/* 페이징 영역 */}
      <div>QnAPaging_Part</div>
    </div>
  )
}
