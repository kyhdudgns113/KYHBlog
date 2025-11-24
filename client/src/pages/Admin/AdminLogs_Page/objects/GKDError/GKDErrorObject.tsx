import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {LogType} from '@shareType'

import './GKDErrorObject.scss'

type GKDErrorObjectProps = DivCommonProps & {log: LogType}

export const GKDErrorObject: FC<GKDErrorObjectProps> = ({log, className, style, ...props}) => {
  const gkd = log.gkd

  return (
    <div
      className={`GKDError_Object _object_modal ${className || ''}`}
      onClick={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      {/* 1. 타이틀 */}
      <div className={`_objects_title`}>에러 목록</div>

      {/* 2. 에러 메시지 */}
      <div className={`_objects_message`}>{log.where || '장소 미상'}</div>

      {/* 3. 에러 목록 테이블 */}
      <table className={`_objects_table`}>
        <thead>
          <tr>
            <th className={`_th_key`}>키</th>
            <th className={`_th_value`}>값</th>
          </tr>
        </thead>
        <tbody>
          {/* 1. 로그 발생지점 */}
          <tr>
            <td>where</td>
            <td>{log.where || '장소 미상'}</td>
          </tr>

          {/* 2. 에러코드 */}
          <tr>
            <td>gkdErrCode</td>
            <td>{log.gkdErrCode || '에러코드 미상'}</td>
          </tr>

          {Object.entries(gkd).map(([key, value], idx) => (
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

