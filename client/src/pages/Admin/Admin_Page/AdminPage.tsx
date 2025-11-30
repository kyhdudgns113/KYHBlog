import {useEffect, useRef, useState} from 'react'

import {PostingPart, UsersPart, LogsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AdminPage.scss'

type AdminPageProps = DivCommonProps & {}

export const AdminPage: FC<AdminPageProps> = ({...props}) => {
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined)

  const rowPartRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // DOM이 완전히 렌더링된 후 너비 계산
    const calculateMaxWidth = () => {
      const widths = rowPartRefs.current.filter(ref => ref !== null).map(ref => ref!.scrollWidth)

      if (widths.length > 0) {
        const max = Math.max(...widths)
        setMaxWidth(max)
      }
    }

    // 다음 프레임에서 실행하여 DOM 렌더링 완료 보장
    requestAnimationFrame(() => {
      requestAnimationFrame(calculateMaxWidth)
    })
  }, [])

  useEffect(() => {
    if (maxWidth !== undefined) {
      rowPartRefs.current.forEach(ref => {
        if (ref !== null) {
          ref.style.width = `${maxWidth}px`
        }
      })
    }
  }, [maxWidth])

  return (
    <div className={`AdminPage`} {...props}>
      {/* 0번째 행: Posting, Users */}
      <div
        className="_row_part"
        ref={el => {
          rowPartRefs.current[0] = el
        }}
      >
        <PostingPart />
        <UsersPart />
      </div>

      {/* 1번째 행: Logs */}
      <div
        className="_row_part"
        ref={el => {
          rowPartRefs.current[1] = el
        }}
      >
        <LogsPart />
      </div>
    </div>
  )
}
