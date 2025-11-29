import {QnAHeaderPart, QnATablePart, QnAPagingPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAPage.scss'

type QnAPageProps = DivCommonProps & {}

export const QnAPage: FC<QnAPageProps> = ({...props}) => {
  return (
    <div className={`QnAPage`} {...props}>
      <div className="_wrapper_page">
        <QnAHeaderPart />
        <QnATablePart />
        <QnAPagingPart />
      </div>
    </div>
  )
}
