import {CheckAuth} from '@guard'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAReadPage.scss'

type QnAReadPageProps = DivCommonProps & {
  reqAuth: number
}

export const QnAReadPage: FC<QnAReadPageProps> = ({reqAuth, ...props}) => {
  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`QnAReadPage`} {...props}>
        <div>QnAReadPage</div>
      </div>
    </CheckAuth>
  )
}
