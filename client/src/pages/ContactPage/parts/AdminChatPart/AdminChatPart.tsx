import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import {Icon} from '@component'

import './AdminChatPart.scss'

type AdminChatPartProps = DivCommonProps & {}

export const AdminChatPart: FC<AdminChatPartProps> = ({...props}) => {
  const onClickAdminChat = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO: 관리자 userOId 가져오기
      // TODO: loadUserChatRoom(userOId, adminUserOId) 호출하여 관리자와의 채팅방 열기
      // TODO: 로그인 체크 필요
    },
    []
  )

  return (
    <div className={`AdminChat_Part`} {...props}>
      <div className="_contact_item" onClick={onClickAdminChat}>
        <div className="_icon_wrapper">
          <Icon iconName="admin_panel_settings" className="_icon" />
        </div>
        <div className="_contact_info">
          <span className="_contact_label">관리자 채팅</span>
          <span className="_contact_value">관리자에게 문의하기</span>
        </div>
        <Icon iconName="arrow_forward" className="_arrow_icon" />
      </div>
    </div>
  )
}

