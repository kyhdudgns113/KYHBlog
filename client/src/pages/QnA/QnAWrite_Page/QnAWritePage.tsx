import {HeaderBtnRowPart, QnAWrittingPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAWritePage.scss'

type QnAWritePageProps = DivCommonProps & {}

export const QnAWritePage: FC<QnAWritePageProps> = ({...props}) => {
  return (
    <div className={`QnAWritePage`} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_page">QnA 작성</p>

      {/* 2. 상단 버튼 행 */}
      <HeaderBtnRowPart />

      {/* 3. 작성 폼 */}
      <QnAWrittingPart />
    </div>
  )
}
