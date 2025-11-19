import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type CommentLengthProps = DivCommonProps & {comment: string}

/**
 * 댓글이나 대댓글의 글자수를 표시하는 컴포넌트
 */
export const CommentLength: FC<CommentLengthProps> = ({comment, className, style, ...props}) => {
  return (
    <div className={`CommentLength ${className || ''}`} style={style} {...props}>
      <p className="_length">
        {comment.length ?? 0}/{COMMENT_MAX_LENGTH}
      </p>
    </div>
  )
}
