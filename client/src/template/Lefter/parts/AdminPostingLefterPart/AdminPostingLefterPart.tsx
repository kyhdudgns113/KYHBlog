import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AdminPostingLefterPart.scss'

type AdminPostingLefterPartProps = DivCommonProps & {
  closePart: () => void
}

export const AdminPostingLefterPart: FC<AdminPostingLefterPartProps> = ({closePart, className, ...props}) => {
  return (
    <div className={`AdminPostingLefter_Part SCROLL_WHITE ${className || ''}`} {...props}>
      AdminPostingLefter
    </div>
  )
}
