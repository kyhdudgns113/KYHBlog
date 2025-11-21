import {CommentInfoGroup, CommentPagingGroup, ReplyInfoGroup} from '../../groups'
import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './CommentListObject.scss'

type CommentListObjectProps = DivCommonProps

export const CommentListObject: FC<CommentListObjectProps> = ({...props}) => {
  const commentReplyArr = useBlogSelector(state => state.comment.commentReplyArr)
  const pageIdx = useBlogSelector(state => state.comment.pageIdx)

  return (
    <div className="CommentList_Object" {...props}>
      {/* 1. 댓글 및 대댓글 배열 */}
      {commentReplyArr.map((element, elemIdx) => {
        const isNowIdx = pageIdx === Math.floor(elemIdx / 10)
        const isReply = 'replyOId' in element
        const isLast = elemIdx === commentReplyArr.length - 1 || elemIdx % 10 === 9

        if (!isNowIdx) {
          return null
        }

        return (
          <div className={`_commentReplyContainer _${elemIdx} ${isLast ? '_last' : ''}`} key={elemIdx}>
            {isReply ? <ReplyInfoGroup reply={element} /> : <CommentInfoGroup comment={element} />}
          </div>
        )
      })}

      {/* 2. 댓글 페이징 */}
      <CommentPagingGroup />
    </div>
  )
}

