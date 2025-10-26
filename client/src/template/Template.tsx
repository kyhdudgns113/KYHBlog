import {Outlet} from 'react-router-dom'

import {Header} from './Header'
import {Lefter} from './Lefter'
import {Righter} from './Righter'
import {Footer} from './Footer'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/Template.scss'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  return (
    <div className={`Template ${className || ''}`} {...props}>
      <Header />
      <div className="Body">
        <Lefter />
        <div className="PageArea">
          <Outlet />
        </div>
        <Righter />
      </div>
      <Footer />
    </div>
  )
}
