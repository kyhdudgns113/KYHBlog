import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './BlogLefterPart.scss'

type BlogLefterPartProps = DivCommonProps & {
  closePart: () => void
}

export const BlogLefterPart: FC<BlogLefterPartProps> = ({closePart, className, ...props}) => {
  return (
    <div className={`BlogLefter_Part ${className || ''}`} {...props}>
      BlogLefterPart
    </div>
  )
}
