import {HeaderButtonRowObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAHeaderPart.scss'

type QnAHeaderPartProps = DivCommonProps & {}

export const QnAHeaderPart: FC<QnAHeaderPartProps> = ({className, ...props}) => {
  return (
    <div className={`QnAHeader_Part ${className || ''}`} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_page">Q&A 페이지</p>

      {/* 2. 버튼 행 */}
      <HeaderButtonRowObject />
    </div>
  )
}
