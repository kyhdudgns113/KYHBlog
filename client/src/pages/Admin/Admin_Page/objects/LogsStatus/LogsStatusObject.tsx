import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {LogType} from '@shareType'

import './LogsStatusObject.scss'

type LogsStatusObjectProps = DivCommonProps & {
  isLoadingLogArr: boolean | null
  logArr: LogType[]
}

export const LogsStatusObject: FC<LogsStatusObjectProps> = ({isLoadingLogArr, logArr, className, style, ...props}) => {
  return (
    <div className={`LogsStatus_Object ${className || ''}`} onClick={e => e.stopPropagation()} style={style} {...props}>
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
