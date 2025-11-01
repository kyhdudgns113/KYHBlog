import {useCallback, useState} from 'react'
import {useAdminCallbacksContext} from '@context'
import {useAdminActions, useAdminStates} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

import './AdminUsersPage.scss'

type AdminUsersPageProps = DivCommonProps

// prettier-ignore
export const AdminUsersPage: FC<AdminUsersPageProps> = ({className, style, ...props}) => {
  const {isLoadingUserArr} = useAdminStates()
  const {resetIsLoadingUserArr, setIsLoadingUserArr} = useAdminActions()
  const {loadUserArr} = useAdminCallbacksContext()

  const [pageIdx, setPageIdx] = useState<number>(0)
  const [pageTenIdx, setPageTenIdx] = useState<number>(0)
  
  const onClickTitle = useCallback((isLoading: boolean | null) => (e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()

    if (isLoading) {
      alert('아직 로딩중입니다.')
      return
    }

    setIsLoadingUserArr(true)
    loadUserArr(true)
      .then(ok => {
        if (ok) {
            setIsLoadingUserArr(false)
        } // ::
        else {
          resetIsLoadingUserArr()
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`AdminUsersPage ${className || ''}`} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title" onClick={onClickTitle(isLoadingUserArr)}>유저 관리 페이지</p>

        {/* 2. 유저 목록 테이블 */}
        <P.UserTablePart pageIdx={pageIdx}/>

        {/* 3. 페이징 */}
        <P.PagingPart pageIdx={pageIdx} pageTenIdx={pageTenIdx} setPageIdx={setPageIdx} setPageTenIdx={setPageTenIdx} />
      </div>
    </div>
  )
}
