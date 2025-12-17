import {useCallback} from 'react'

import {useAuthStatesContext, useChatCallbacksContext} from '@context'
import {useTemplateActions, useChatActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import {Icon} from '@component'

import './AdminChatPart.scss'

type AdminChatPartProps = DivCommonProps & {}

export const AdminChatPart: FC<AdminChatPartProps> = ({...props}) => {
  const {clickLogInBtn} = useTemplateActions()
  const {setChatRoomOId} = useChatActions()

  const {isLoggedIn, userOId} = useAuthStatesContext()
  const {loadAdminChatRoom} = useChatCallbacksContext()

  const onClickAdminChat = useCallback(
    (isLoggedIn: boolean, userOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      if (!isLoggedIn) {
        alert('로그인 이후 이용해주세요.')
        clickLogInBtn()
        return
      }

      loadAdminChatRoom(userOId) // ::
        .then(res => {
          if (res.isSuccess) {
            setChatRoomOId(res.chatRoomOId)
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`AdminChat_Part`} {...props}>
      <div className="_contact_item" onClick={onClickAdminChat(isLoggedIn, userOId)}>
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
