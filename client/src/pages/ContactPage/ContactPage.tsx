import {useAuthStatesContext} from '@context'

import {KakaoPart, EmailPart, AdminChatPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './ContactPage.scss'

type ContactPageProps = DivCommonProps & {}

export const ContactPage: FC<ContactPageProps> = ({...props}) => {
  const {userAuth} = useAuthStatesContext()

  const isAdmin = userAuth === SV.AUTH_ADMIN

  return (
    <div className={`ContactPage`} {...props}>
      <div className="_container_contact">
        {/* 1. 타이틀 */}
        <h1 className="_title_contact">연락처</h1>

        {/* 2. 서브타이틀 */}
        <p className="_subtitle_contact">문의사항이 있으시면 언제든지 연락주세요!</p>

        {/* 3. 카카오톡, 이메일, 관리자 채팅 파트 */}
        <div className="_contact_items">
          <KakaoPart />
          <EmailPart />
          {!isAdmin && <AdminChatPart />}
        </div>
      </div>
    </div>
  )
}
