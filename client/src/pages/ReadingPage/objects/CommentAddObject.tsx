import {useCommentStates} from '@redux'

import {CommentLength} from '../components'
import {CommentWrittingGroup} from '../groups'
import {SubmitCommentButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/CommentAddObject.scss'

type CommentAddObjectProps = DivCommonProps

/**
 * 댓글 작성 오브젝트
 *
 * 구성
 *
 *   1. 오브젝트 이름
 *   2. 댓글 작성 칸
 *   3. 글자수 표시 칸
 *   4. 댓글 작성 버튼
 */
export const CommentAddObject: FC<CommentAddObjectProps> = ({className, style, ...props}) => {
  const {commentContent} = useCommentStates()

  return (
    <div className={`CommentAdd_Object ${className || ''}`} style={style} {...props}>
      {/* 1. 오브젝트 이름 */}
      <p className="_title_object">댓글 작성</p>

      {/* 2. 댓글 작성 칸 */}
      <CommentWrittingGroup />

      {/* 3. 글자수 표시 칸 */}
      <CommentLength comment={commentContent} />

      {/* 4. 댓글 작성 버튼 */}
      <SubmitCommentButton />
    </div>
  )
}
