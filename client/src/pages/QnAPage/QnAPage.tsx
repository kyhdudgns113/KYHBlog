import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAPage.scss'

type QnAPageProps = DivCommonProps & {}

export const QnAPage: FC<QnAPageProps> = ({...props}) => {
  return (
    <div className={`QnAPage`} {...props}>
      <p>Q&A 페이지</p>
    </div>
  )
}

