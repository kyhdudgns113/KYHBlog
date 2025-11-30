import type {FC} from 'react'
import type {TableCommonProps} from '@prop'

import './QnATablePart.scss'

type QnATablePartProps = TableCommonProps & {}

export const QnATablePart: FC<QnATablePartProps> = ({...props}) => {
  return (
    <table className={`QnATable_Part`} {...props}>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>제목</td>
          <td>작성자</td>
          <td>작성일</td>
          <td>조회수</td>
        </tr>
      </tbody>
    </table>
  )
}
