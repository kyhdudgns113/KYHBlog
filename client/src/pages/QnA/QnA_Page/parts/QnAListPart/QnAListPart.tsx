import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAListPart.scss'

type QnAListPartProps = DivCommonProps & {}

export const QnAListPart: FC<QnAListPartProps> = ({className, ...props}) => {
  return (
    <div className={`QnAList_Part ${className || ''}`} {...props}>
      {/* 질문글 리스트 영역 */}
      <div>QnAList_Part</div>
    </div>
  )
}
