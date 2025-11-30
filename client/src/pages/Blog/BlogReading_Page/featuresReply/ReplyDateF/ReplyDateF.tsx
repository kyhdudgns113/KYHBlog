import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './ReplyDateF.scss'

type ReplyDateFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

/**
 * 댓글 작성 시간을 표시하는 컴포넌트이다.
 */
export const ReplyDateF: FC<ReplyDateFProps> = ({reply, ...props}) => {
  return (
    <div
      className={`ReplyDate_F`}
      onMouseDown={e => e.preventDefault()}
      {...props} // ::
    >
      {new Date(reply.createdAtValue).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  )
}

