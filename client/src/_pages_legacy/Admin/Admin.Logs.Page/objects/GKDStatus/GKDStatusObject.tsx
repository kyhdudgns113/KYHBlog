import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {LogType} from '@shareType'

import './GKDStatusObject.scss'

type GKDStatusObjectProps = DivCommonProps & {log: LogType}

export const GKDStatusObject: FC<GKDStatusObjectProps> = ({log, className, style, ...props}) => {
  const gkdStatus = log.gkdStatus

  return (
    <div
      className={`GKDStatus_Object _object_modal ${className || ''}`}
      onClick={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      {/* 1. 타이틀 */}
      <div className="_objects_title">상태 목록</div>

      {/* 2. 상태 목록 테이블 */}
      <table className="_objects_table">
        <thead>
          <tr>
            <th className="_th_key">키</th>
            <th className="_th_value">값</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gkdStatus).map(([key, value], idx) => (
            <tr key={idx}>
              <td>{key}</td>
              <td>{value as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
