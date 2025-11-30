import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAWrittingPart.scss'

type QnAWrittingPartProps = DivCommonProps & {}

export const QnAWrittingPart: FC<QnAWrittingPartProps> = ({...props}) => {
  return (
    <div className={`QnAWritting_Part `} {...props}>
      QnAWrittingPart.tsx
    </div>
  )
}

