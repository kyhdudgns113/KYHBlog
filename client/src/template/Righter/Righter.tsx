import {useEffectEvent} from 'react'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Righter.scss'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({...props}) => {
  useEffectEvent(() => {})

  return (
    <div className={`Righter`} {...props}>
      Righter
    </div>
  )
}
