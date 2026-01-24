import {IntroPart, NullPart, RecentPostsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HomePage.scss'

type HomePageProps = DivCommonProps & {}

export const HomePage: FC<HomePageProps> = ({...props}) => {
  return (
    <div className={`HomePage`} {...props}>
      <IntroPart />

      <div className="_recent_row_page">
        <RecentPostsPart />
        <NullPart />
        <NullPart />
      </div>
    </div>
  )
}
