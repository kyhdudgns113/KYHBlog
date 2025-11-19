import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/CommentDateF.scss'

type CommentDateFProps = DivCommonProps & {comment: LT.CommentTypeLocal}

/**
 * 댓글 작성 시간을 표시하는 컴포넌트이다.
 */
export const CommentDateF: FC<CommentDateFProps> = ({comment, className, style, ...props}) => {
  return (
    <div
      className={`CommentDate_F ${className || ''}`}
      onMouseDown={e => e.preventDefault()}
      style={style}
      {...props} // ::
    >
      {new Date(comment.createdAtValue).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  )
}
