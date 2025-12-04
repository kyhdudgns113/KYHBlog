import {useCallback} from 'react'

import {useBlogSelector, useQnAActions} from '@redux'

import {QnALeftButton, QnARightButton} from '../../buttons'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as V from '@value'

import './QnAPagingPart.scss'

type QnAPagingPartProps = DivCommonProps & {}

export const QnAPagingPart: FC<QnAPagingPartProps> = ({...props}) => {
  const {setQnAPageIdx} = useQnAActions()
  const qnAPageIdx = useBlogSelector(state => state.qna.qnAPageIdx)
  const qnAPageTenIdx = useBlogSelector(state => state.qna.qnAPageTenIdx)
  const qnARowArr = useBlogSelector(state => state.qna.qnARowArr)

  const maxPageTenIdx = Math.floor(qnARowArr.length / (10 * V.QNA_PER_PAGE))

  const onClickPageIdx = useCallback(
    (nowIdx: number) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setQnAPageIdx(nowIdx)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`QnAPaging_Part`} {...props}>
      {/* 1. 왼쪽 화살표: 이전 10개 목록 */}
      {qnAPageTenIdx > 0 && <QnALeftButton className={`_button_part`} />}

      {/* 2. 현재 10개 목록 */}
      {Array(10)
        .fill(0)
        .map((_, idx) => {
          const nowNumber = 10 * qnAPageTenIdx + idx + 1
          const nowIdx = nowNumber - 1
          const isNowIdx = nowIdx === qnAPageIdx

          if (nowIdx * V.QNA_PER_PAGE > qnARowArr.length) {
            return null
          }

          return (
            <div className={`_page_index_part ${isNowIdx ? '_nowIdx' : ''}`} key={idx} onClick={onClickPageIdx(nowIdx)}>
              {nowNumber}
            </div>
          )
        })}

      {/* 3. 우측 화살표: 다음 10개 목록 */}
      {qnAPageTenIdx < maxPageTenIdx && <QnARightButton className={`_button_part`} />}
    </div>
  )
}
