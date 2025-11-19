import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type QnAPartProps = DivCommonProps & {}

export const QnAPart: FC<QnAPartProps> = ({...props}) => {
  return (
    <div className={`QnA_Part _part_common`} {...props}>
      Q&A
    </div>
  )
}
