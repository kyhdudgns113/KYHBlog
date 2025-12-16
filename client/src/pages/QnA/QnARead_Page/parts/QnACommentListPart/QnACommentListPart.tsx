import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnACommentListPart.scss'

type QnACommentListPartProps = DivCommonProps

export const QnACommentListPart: FC<QnACommentListPartProps> = ({...props}) => {
  const qnACommentArr = useBlogSelector(state => state.qna.qnACommentArr)

  return (
    <div className={`QnACommentList_Part`} {...props}>
      {/* 1. 댓글 목록 제목 */}
      <p className="_title_object">댓글 목록</p>

      {/* 2. 댓글 목록 */}
      <div className="_comment_list">
        {qnACommentArr.length === 0 ? (
          <div className="_empty_message">댓글이 없습니다.</div>
        ) : (
          qnACommentArr.map(comment => (
            <div key={comment.qCommentOId} className="_comment_item">
              {/* TODO: 댓글 아이템 구조 구현 */}
              <div className="_comment_content">{comment.content}</div>
              <div className="_comment_info">
                <span className="_comment_author">{comment.userName}</span>
                <span className="_comment_date">{new Date(comment.createdAtValue).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
