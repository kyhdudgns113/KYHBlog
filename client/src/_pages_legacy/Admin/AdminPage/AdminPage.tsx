import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

import './AdminPage.scss'

type AdminPageProps = DivCommonProps

// prettier-ignore
export const AdminPage: FC<AdminPageProps> = ({className, style, ...props}) => {
  return (
    <div className={`AdminPage ${className || ''}`} style={style} {...props}>
      <div className={`_pageWrapper`}>
        {/* 1. 타이틀 */}
        <p className={`_page_title`}>관리자 페이지</p>

        {/* 2. 0번째 행: 유저, 로그 */}
        <div className={`_page_row _row_0`}>
          <P.UsersPart />
          <P.LogsPart />
        </div>

        {/* 3. 1번째 행: 게시글, 빈 블록 */}
        <div className={`_page_row _row_1`}>
          <P.PostsPart />
          <P.EmptyPart />
        </div>
      </div>
    </div>
  )
}
