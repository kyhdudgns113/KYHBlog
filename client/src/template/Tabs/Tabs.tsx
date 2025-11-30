import {HomePart, BlogPart, QnAPart, ContactPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Tabs.scss'

type TabsProps = DivCommonProps & {}

export const Tabs: FC<TabsProps> = ({...props}) => {
  return (
    <div className={`Tabs`} {...props}>
      <HomePart />
      <BlogPart />
      <ContactPart />
      <QnAPart />
    </div>
  )
}
