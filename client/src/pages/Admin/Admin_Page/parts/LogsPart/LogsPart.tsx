import {useCallback} from 'react'

import {useAdminCallbacksContext} from '@context'
import {useAdminActions, useBlogSelector} from '@redux'

import {LogsButton} from '../../buttons'
import {LogsStatusObject} from '../../objects'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './LogsPart.scss'

type LogsPartProps = DivCommonProps & {}

export const LogsPart: FC<LogsPartProps> = ({className, style, ...props}) => {
  const isLoadingLogArr = useBlogSelector(state => state.admin.isLoadingLogArr)
  const logArr = useBlogSelector(state => state.admin.logArr)
  const {setIsLoadingLogArr} = useAdminActions()
  const {loadLogArr} = useAdminCallbacksContext()

  const onClickTitle = useCallback(
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
      <p className={`_title_part`} onClick={onClickTitle(isLoadingLogArr)}>
        Logs
      </p>

      {/* 2, 3. 로그 상태 */}
      <LogsStatusObject isLoadingLogArr={isLoadingLogArr} logArr={logArr} />

      {/* 4. Logs 버튼 */}
      <LogsButton />
    </div>
  )
}
