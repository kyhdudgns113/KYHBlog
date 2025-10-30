import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {ReplyType} from '@shareType'

import './_styles/ReplyDateF.scss'

type ReplyDateFProps = DivCommonProps & {reply: ReplyType}

/**
 * 댓글 작성 시간을 표시하는 컴포넌트이다.
 */
export const ReplyDateF: FC<ReplyDateFProps> = ({reply, className, style, ...props}) => {
  return (
    <div
      className={`ReplyDate_F ${className || ''}`}
      onMouseDown={e => e.preventDefault()}
      style={style}
      {...props} // ::
    >
      {new Date(reply.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  )
}
