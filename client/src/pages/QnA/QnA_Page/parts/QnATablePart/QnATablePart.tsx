import {useBlogSelector} from '@redux'

import {QnARowObject} from '../../objects'

import type {FC} from 'react'
import type {TableCommonProps} from '@prop'

import './QnATablePart.scss'

type QnATablePartProps = TableCommonProps & {}

export const QnATablePart: FC<QnATablePartProps> = ({...props}) => {
  const qnARowArr = useBlogSelector(state => state.qna.qnARowArr)

  return (
    <table className={`QnATable_Part`} {...props}>
      <thead>
        <tr>
          <th className="_th_createdAt">작성일</th>
          <th className="_th_title">제목</th>
          <th className="_th_author">작성자</th>
        </tr>
      </thead>
      <tbody>
        {qnARowArr.map(qnARow => (
          <QnARowObject key={qnARow.qnAOId} qnARow={qnARow} />
        ))}
      </tbody>
    </table>
  )
}
