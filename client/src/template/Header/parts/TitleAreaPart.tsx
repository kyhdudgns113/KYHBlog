import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_TitleArea.scss'

type TitleAreaPartProps = DivCommonProps & {}

export const TitleAreaPart: FC<TitleAreaPartProps> = ({className, ...props}) => {
  return (
    <div className={`TitleArea_Part ${className || ''}`} {...props}>
      TitleAreaPart
    </div>
  )
}
