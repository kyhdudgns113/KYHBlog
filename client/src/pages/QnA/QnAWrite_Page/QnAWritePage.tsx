import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAWritePage.scss'

type QnAWritePageProps = DivCommonProps & {}

export const QnAWritePage: FC<QnAWritePageProps> = ({...props}) => {
  return (
    <div className={`QnAWritePage`} {...props}>
      <div>QnAWritePage</div>
    </div>
  )
}
