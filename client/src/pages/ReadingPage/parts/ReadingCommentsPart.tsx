import {CommentAddObject, CommentListObject} from '../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/ReadingCommentsPart.scss'

type ReadingCommentsPartProps = DivCommonProps

export const ReadingCommentsPart: FC<ReadingCommentsPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`ReadingComments_Part ${className || ''}`} style={style} {...props}>
      <CommentAddObject />

      <div className="_bottomLine" />

      <CommentListObject />
    </div>
  )
}
