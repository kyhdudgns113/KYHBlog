import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AlarmListObj.scss'

type AlarmListObjProps = DivCommonProps & {}

export const AlarmListObj: FC<AlarmListObjProps> = ({...props}) => {
  return (
    <div className={`AlarmList_Object`} {...props}>
      {/* 알림 목록이 여기에 표시됩니다 */}
    </div>
  )
}




