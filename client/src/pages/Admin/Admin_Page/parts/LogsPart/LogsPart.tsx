import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAdminCallbacksContext} from '@context'
import {Icon} from '@component'
import {useAdminActions, useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './LogsPart.scss'

type LogsPartProps = DivCommonProps & {}

export const LogsPart: FC<LogsPartProps> = ({className, style, ...props}) => {
  const isLoadingLogArr = useBlogSelector(state => state.admin.isLoadingLogArr)
  const logArr = useBlogSelector(state => state.admin.logArr)
  const {setIsLoadingLogArr} = useAdminActions()
  const {loadLogArr} = useAdminCallbacksContext()

  const navigate = useNavigate()

  const onClickTitle = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()

    navigate('/main/admin/logs')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickRefresh = useCallback(
    (isLoadingLogArr: boolean | null) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()

      if (isLoadingLogArr) {
        alert('아직 로딩중입니다.')
        return
      }

      setIsLoadingLogArr(true)

      loadLogArr(true) // ::
        .then(ok => {
          if (ok) {
            setIsLoadingLogArr(false)
          } // ::
          else {
            setIsLoadingLogArr(null)
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`Logs_Part ${className || ''}`} style={style} {...props}>
      {/* 1. 타이틀 */}
      <div className={`_part_title`}>
        <p className={`_part_title_text`} onClick={onClickTitle}>
          Logs
        </p>
        <Icon className={`_part_title_icon`} iconName="refresh" onClick={onClickRefresh(isLoadingLogArr)} />
      </div>

      {/* 2. 로딩 상태 */}
      {isLoadingLogArr && <p className={`_part_content`}>Loading...</p>}
      {isLoadingLogArr === null && <p className={`_part_content`}>Loading Error</p>}

      {/* 3. 전체 로그수 */}
      {!isLoadingLogArr && isLoadingLogArr !== null && (
        <>
          <p className={`_part_content`}>전체 로그수: {logArr.filter(log => (log.gkdErrMsg?.length || 0) === 0).length}</p>
          <p className={`_part_content`}>전체 에러수: {logArr.filter(log => (log.gkdErrMsg?.length || 0) > 0).length}</p>
        </>
      )}
    </div>
  )
}

