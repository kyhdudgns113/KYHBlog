import {useBlogSelector} from '@redux'

import {HomePart, BlogPart, QnAPart, ContactPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Tabs.scss'

type TabsProps = DivCommonProps & {}

export const Tabs: FC<TabsProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)
  return (
    <div className={`Tabs ${nowTab || ''}`} {...props}>
      <HomePart />
      <BlogPart />
      <ContactPart />
      <QnAPart />
    </div>
  )
}
