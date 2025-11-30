import type {FC} from 'react'
import type {TableCommonProps} from '@prop'

import './QnATablePart.scss'

type QnATablePartProps = TableCommonProps & {}

export const QnATablePart: FC<QnATablePartProps> = ({...props}) => {
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
        <tr>
          <td className="_td_createdAt">25.12.01 월</td>
          <td className="_td_title">제목</td>
          <td className="_td_author">작성자</td>
        </tr>
      </tbody>
    </table>
  )
}
