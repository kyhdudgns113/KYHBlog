import {CheckAuth} from '@guard'

import {HeaderPart, QnAFormPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAWritePage.scss'

type QnAWritePageProps = DivCommonProps & {
  reqAuth: number
}

export const QnAWritePage: FC<QnAWritePageProps> = ({reqAuth, ...props}) => {
  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`QnAWritePage`} {...props}>
        <div className="_container_page">
          {/* 1. 상단 헤더 */}
          <HeaderPart />

          {/* 2. 작성 폼 */}
          <QnAFormPart />
        </div>
      </div>
    </CheckAuth>
  )
}
