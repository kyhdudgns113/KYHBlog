import './Tabs.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type TabsProps = DivCommonProps & {}

export const Tabs: FC<TabsProps> = ({...props}) => {
  return (
    <div className={`Tabs`} {...props}>
      Tabs
    </div>
  )
}
