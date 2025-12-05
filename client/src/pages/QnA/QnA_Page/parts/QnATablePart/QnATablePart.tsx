import {useBlogSelector} from '@redux'

import {QnARowObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as V from '@value'

import './QnATablePart.scss'

type QnATablePartProps = DivCommonProps & {}

export const QnATablePart: FC<QnATablePartProps> = ({className, ...props}) => {
  const qnAPageIdx = useBlogSelector(state => state.qna.qnAPageIdx)
  const qnARowArr = useBlogSelector(state => state.qna.qnARowArr)

  return (
    <div className={`QnATable_Part ${className || ''}`} {...props}>
      <table className="_table">
        <thead>
          <tr>
            <th className="_th_createdAt">작성일</th>
            <th className="_th_title">제목</th>
            <th className="_th_author">작성자</th>
          </tr>
        </thead>
        <tbody>
          {qnARowArr.map((qnARow, qnARowIdx) => {
            if (qnAPageIdx * V.QNA_PER_PAGE <= qnARowIdx && qnARowIdx < (qnAPageIdx + 1) * V.QNA_PER_PAGE) {
              return <QnARowObject key={qnARow.qnAOId} qnARow={qnARow} />
            } // ::
            else {
              return null
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
