import {Outlet} from 'react-router-dom'

import {Header} from './Header'
import {Tabs} from './Tabs'
import {Footer} from './Footer'
import {Lefter} from './Lefter'
import {Righter} from './Righter'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Template.scss'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({...props}) => {
  return (
    <div className={`Template`} {...props}>
      <Header />
      <Tabs />
      <div className="Body_Template">
        <Lefter />
        <div className="PageArea_Template">
          <Outlet />
        </div>
        <Righter />
      </div>
      <Footer />
    </div>
  )
}
