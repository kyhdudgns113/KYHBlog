import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './PostingStatusObject.scss'

type PostingStatusObjectProps = DivCommonProps & {}

export const PostingStatusObject: FC<PostingStatusObjectProps> = ({className, style, ...props}) => {
  return (
    <div className={`PostingStatus_Object ${className || ''}`} onClick={e => e.stopPropagation()} style={style} {...props}>
      Posting Status Obj
    </div>
  )
}
