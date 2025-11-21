import {CancelDelCommentButton, SubmitDelCommentButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './CommentDelModalF.scss'

type CommentDelModalFProps = DivCommonProps & {comment: LT.CommentTypeLocal}
export const CommentDelModalF: FC<CommentDelModalFProps> = ({comment, className, style, ...props}) => {
  return (
    <div
      className={`CommentDelModal_F ${comment.commentOId} ${className || ''}`}
      onClick={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      {/* 1. Title */}
      <p className="__title">삭제할까요?</p>

      {/* 2. Button Row: 삭제, 취소 */}
      <div className="_commentDelModalBtnRow">
        <SubmitDelCommentButton comment={comment} />
        <CancelDelCommentButton />
      </div>
    </div>
  )
}

