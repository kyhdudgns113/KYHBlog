import {useCallback} from 'react'

import {Icon} from '@component'
import {useBlogSelector} from '@redux'
import {ADMIN_USER_PER_PAGE} from '@value'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter} from '@type'

import './PagingPart.scss'

type PagingPartProps = DivCommonProps & {
  pageIdx: number
  pageTenIdx: number
  setPageIdx: Setter<number>
  setPageTenIdx: Setter<number>
}

export const PagingPart: FC<PagingPartProps> = ({pageIdx, pageTenIdx, setPageIdx, setPageTenIdx, className, style, ...props}) => {
  const userArr = useBlogSelector(state => state.admin.userArr)

  /* eslint-disable */
  const onClickMoveTenIdx = useCallback(
    (newIdx: number) => (_: MouseEvent<HTMLDivElement>) => {
      setPageTenIdx(newIdx)
    },
    []
  )
  /* eslint-enable */

  /* eslint-disable */
  const onClickIdx = useCallback(
    (newIdx: number) => (_: MouseEvent<HTMLDivElement>) => {
      setPageIdx(newIdx)
    },
    []
  )
  /* eslint-enable */

  return (
    <div className={`Paging_Part ${className || ''}`} style={style} {...props}>
      {/* 1. 이전 pageTenIdx */}
      {pageTenIdx > 0 && <Icon className="_part_button" iconName="arrow_left" onClick={onClickMoveTenIdx(pageTenIdx - 1)} />}

      {/* 2. 현재 pageTenIdx */}
      {Array(10)
        .fill(0)
        .map((_, idx) => {
          const nowNumber = 10 * pageTenIdx + idx + 1
          const nowIdx = nowNumber - 1
          const isNowIdx = nowIdx === pageIdx

          // 초과 시 null 반환
          if (nowIdx * ADMIN_USER_PER_PAGE > userArr.length) {
            return null
          }

          return (
            <div className={`_part_index_button ${isNowIdx ? '_nowIdx' : ''}`} key={idx} onClick={onClickIdx(nowIdx)}>
              {nowNumber}
            </div>
          )
        })}

      {/* 3. 다음 pageTenIdx */}
      {pageTenIdx < Math.floor(userArr.length / ADMIN_USER_PER_PAGE) - 1 && (
        <Icon className="_part_button" iconName="arrow_right" onClick={onClickMoveTenIdx(pageTenIdx + 1)} />
      )}
    </div>
  )
}
