import {useCallback} from 'react'
import {useBlogSelector, useCommentActions} from '@redux'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/CommentPagingGroup.scss'

type CommentPagingGroupProps = DivCommonProps & {}

export const CommentPagingGroup: FC<CommentPagingGroupProps> = ({className, style, ...props}) => {
  const commentReplyArr = useBlogSelector(state => state.comment.commentReplyArr)
  const pageIdx = useBlogSelector(state => state.comment.pageIdx)
  const pageTenIdx = useBlogSelector(state => state.comment.pageTenIdx)
  const {decPageTenIdx, incPageTenIdx, setPageIdx} = useCommentActions()

  const isLeftActive = pageTenIdx > 0
  const isRightActive = pageTenIdx < Math.floor(commentReplyArr.length / (10 * 10))

  const onClickIdx = useCallback(
    (newIdx: number) => (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault()
      setPageIdx(newIdx)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onClickLeft = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    decPageTenIdx()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickRight = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    incPageTenIdx()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`CommentPaging_Group ${className || ''}`} style={style} {...props}>
      {/* 1. 버튼: 이전 10개 페이지 목록으로 */}
      {isLeftActive && <Icon className="_left_button" iconName="arrow_left" onClick={onClickLeft} />}

      {/* 2. 페이지 인덱스들 */}
      {Array(10)
        .fill(0)
        .map((_, idx) => {
          const nowNumber = 10 * pageTenIdx + idx + 1
          const nowIdx = nowNumber - 1
          const isNowIdx = 10 * pageTenIdx + idx === pageIdx

          if ((nowNumber - 1) * 10 > commentReplyArr.length) {
            return null
          }

          return (
            <div
              className={`_pageIndex _${idx} ${isNowIdx ? '_nowIdx' : ''}`}
              key={idx}
              onClick={onClickIdx(nowIdx)} // ::
            >
              {nowNumber}
            </div>
          )
        })}

      {/* 3. 버튼: 다음 10개 페이지 목록으로 */}
      {isRightActive && <Icon className="_right_button" iconName="arrow_right" onClick={onClickRight} />}
    </div>
  )
}
