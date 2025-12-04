import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAContentPart.scss'

type QnAContentPartProps = DivCommonProps

export const QnAContentPart: FC<QnAContentPartProps> = ({...props}) => {
  const qnA = useBlogSelector(state => state.qna.qnA)

  return (
    <div className={`QnAContent_Part`} {...props}>
      <div className="_content_wrapper">
        <pre className="_content">{qnA.content}</pre>
      </div>
      <div className={`_bottomLine`} />
    </div>
  )
}

