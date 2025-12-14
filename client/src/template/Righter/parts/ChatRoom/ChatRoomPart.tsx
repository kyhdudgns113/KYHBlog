import {useCallback, useEffect} from 'react'

import {useChatCallbacksContext} from '@context'
import {useBlogSelector, useChatActions} from '@redux'

import {CloseRoomButton} from '../../buttons'
import {ChatRoomUserObject, ChatListObject, ChatSubmitObject} from '../../objects'

import type {FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatRoomPart.scss'

type ChatRoomPartProps = DivCommonProps & {
  isChatRoomListOpen: boolean
}

export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, isChatRoomListOpen = false, ...props}) => {
  const chatRoomOId = useBlogSelector(state => state.chat.chatRoomOId)
  const loadedChatRoomOId = useBlogSelector(state => state.chat.loadedChatRoomOId)

  const {resetChatArr, resetChatRoomOId, resetLoadedChatRoomOId, selectChatRoom} = useChatActions()
  const {loadChatArr} = useChatCallbacksContext()

  const onKeyDownChatRoom = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      resetChatRoomOId()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: 채팅방 정보 불러오기
  useEffect(() => {
    const isChatRoomOpened = chatRoomOId.length > 0
    const isChatArrNotLoaded = chatRoomOId !== loadedChatRoomOId

    if (isChatRoomOpened && isChatArrNotLoaded) {
      selectChatRoom(chatRoomOId)
      loadChatArr(chatRoomOId, -1)
    }

    return () => {
      if (isChatRoomOpened && isChatArrNotLoaded) {
        resetLoadedChatRoomOId()
        resetChatArr()
      }
    }
  }, [chatRoomOId, loadedChatRoomOId])

  return (
    <div
      className={`ChatRoom_Part ${className || ''} ${isChatRoomListOpen ? '_withList' : '_withoutList'}`}
      onKeyDown={onKeyDownChatRoom}
      onScroll={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
      tabIndex={0}
      {...props} // ::
    >
      <CloseRoomButton />
      <ChatRoomUserObject />
      <ChatListObject />
      <ChatSubmitObject />
    </div>
  )
}
