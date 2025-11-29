import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAReadPage.scss'

type QnAReadPageProps = DivCommonProps & {}

export const QnAReadPage: FC<QnAReadPageProps> = ({...props}) => {
  return (
    <div className={`QnAReadPage`} {...props}>
      <div>QnAReadPage</div>
    </div>
  )
}
