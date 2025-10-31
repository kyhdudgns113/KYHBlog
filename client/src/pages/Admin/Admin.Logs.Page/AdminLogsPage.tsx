import {useCallback, useState} from 'react'

import {useAdminCallbacksContext} from '@context'
import {useAdminActions, useAdminStates} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as P from './parts'

import './AdminLogsPage.scss'

type AdminLogsPageProps = DivCommonProps

// prettier-ignore
export const AdminLogsPage: FC<AdminLogsPageProps> = ({className, style, ...props}) => {
  const {isLoadingLogArr} = useAdminStates()
  const {setIsLoadingLogArr, resetLogOId_showError, resetLogOId_showStatus} = useAdminActions()
  const {loadLogArr} = useAdminCallbacksContext()

  const [pageIdx, setPageIdx] = useState<number>(0)
  const [pageTenIdx, setPageTenIdx] = useState<number>(0)

  const onClickPage = useCallback(() => {
    resetLogOId_showError()
    resetLogOId_showStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickTitle = useCallback((isLoading: boolean | null) => (e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()

    if (isLoading) {
      alert('아직 로딩중입니다.')
      return
    }

    setIsLoadingLogArr(true)
    loadLogArr(true)
      .then(ok => {
        if (ok) {
          setIsLoadingLogArr(false)
        } // ::
        else {
          setIsLoadingLogArr(null)
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`AdminLogs_Page ${className || ''}`} onClick={onClickPage} style={style} {...props}>
      <div className="_pageWrapper">
        {/* 1. 타이틀 */}
        <p className="_page_title" onClick={onClickTitle(isLoadingLogArr)}>로그 관리 페이지</p>

        {/* 2. 로그 목록 테이블 */}
        <P.LogTablePart pageIdx={pageIdx} />

        {/* 3. 페이징 */}
        <P.PagingPart pageIdx={pageIdx} pageTenIdx={pageTenIdx} setPageIdx={setPageIdx} setPageTenIdx={setPageTenIdx} />
      </div>
    </div>
  )
}
