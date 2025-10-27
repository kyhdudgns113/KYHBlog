import {Outlet} from 'react-router-dom'

import {useModalState} from '@redux'

import {Header} from './Header'
import {Lefter} from './Lefter'
import {Righter} from './Righter'
import {Footer} from './Footer'
import {LogInModal, SignUpModal} from './Modals'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as V from '@value'

import './_styles/Template.scss'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = useModalState()

  return (
    <div className={`Template ${className || ''}`} {...props}>
      {/* 1. 템플릿 레이아웃 영역 */}
      <Header />
      <div className="Body">
        <Lefter />
        <div className="PageArea">
          <Outlet />
        </div>
        <Righter />
      </div>
      <Footer />

      {/* 2. 모달 영역 */}
      {modalName === V.MODAL_LOG_IN && <LogInModal />}
      {modalName === V.MODAL_SIGN_UP && <SignUpModal />}
    </div>
  )
}
