import {useChatStates, useTemplateStates} from '@redux'

import {ButtonRowPart, ChatRoomPart, ChatRoomListPart} from './parts'
import {ToggleButton} from './buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Righter.scss'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({className, ...props}) => {
  const {isRighterOpen} = useTemplateStates()
  const {chatRoomOId} = useChatStates()

  return (
    <div className={`Righter ${className || ''}`} {...props}>
      {/* 1. 토글 버튼 */}
      <ToggleButton />

      {/* 2. 채팅방 */}
      {chatRoomOId && <ChatRoomPart />}

      {/* 3. Righter 본체 */}
      <div className={`_body_righter ${isRighterOpen ? '_open' : '_close'}`}>
        {/* 3-1. 버튼 행 */}
        <ButtonRowPart />

        {/* 3-2. 채팅방 목록 */}
        <ChatRoomListPart />
      </div>
    </div>
  )
}
