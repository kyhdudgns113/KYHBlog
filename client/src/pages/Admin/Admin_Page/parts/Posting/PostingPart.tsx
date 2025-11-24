import {useCallback} from 'react'
import {PostingButton} from '../../buttons'
import {PostingStatusObject} from '../../objects'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './PostingPart.scss'

type PostingPartProps = DivCommonProps & {}

export const PostingPart: FC<PostingPartProps> = ({...props}) => {
  const onClickTitle = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Posting_Part`} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_part" onClick={onClickTitle}>
        Posting
      </p>

      {/* 2. 현황 */}
      <PostingStatusObject />

      {/* 3. 포스팅 버튼 */}
      <PostingButton />
    </div>
  )
}
