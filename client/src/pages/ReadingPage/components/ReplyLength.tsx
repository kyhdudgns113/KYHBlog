import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReplyLengthProps = DivCommonProps & {reply: string}

/**
 * 대댓글의 글자수를 표시하는 컴포넌트
 */
export const ReplyLength: FC<ReplyLengthProps> = ({reply, className, style, ...props}) => {
  return (
    <div className={`ReplyLength ${className || ''}`} style={style} {...props}>
      <p className="_length">
        {reply.length ?? 0}/{COMMENT_MAX_LENGTH}
      </p>
    </div>
  )
}
