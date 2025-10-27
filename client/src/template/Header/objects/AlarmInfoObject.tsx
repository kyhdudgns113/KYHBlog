import {AlarmIcon} from '../components'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_AlarmInfo.scss'

type AlarmInfoObjectProps = DivCommonProps & {}

export const AlarmInfoObject: FC<AlarmInfoObjectProps> = ({className, ...props}) => {
  return (
    <div className={`AlarmInfo_Object ${className || ''}`} {...props}>
      <AlarmIcon />
    </div>
  )
}
