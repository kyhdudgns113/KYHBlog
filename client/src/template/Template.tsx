import {useCallback} from 'react'
import {Outlet} from 'react-router-dom'

import {useAlarmActions, useBlogSelector} from '@redux'

import {Header} from './Header'
import {Tabs} from './Tabs'
import {Footer} from './Footer'
import {Lefter} from './Lefter'
import {Righter} from './Righter'
import {ModalSetDirectory, ModalSetFile} from './Modals'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as V from '@value'

import './Template.scss'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({...props}) => {
  const modalName = useBlogSelector(state => state.modal.modalName)

  const {closeAlarmObj} = useAlarmActions()

  const onClickTemplate = useCallback((e: MouseEvent<HTMLDivElement>) => {
    closeAlarmObj()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Template`} onClick={onClickTemplate} {...props}>
      <Header />
      <Tabs />
      <div className={`Body_Template`}>
        <Lefter />
        <div className={`PageArea_Template`}>
          <Outlet />
        </div>
        <Righter />
      </div>
      <Footer />

      {/* 모달 영역 */}
      {modalName === V.MODAL_EDIT_DIR && <ModalSetDirectory />}
      {modalName === V.MODAL_EDIT_FILE && <ModalSetFile />}
    </div>
  )
}
