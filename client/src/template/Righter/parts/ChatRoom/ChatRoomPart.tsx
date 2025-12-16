import {useCallback, useEffect, useEffectEvent} from 'react'

import {useAuthStatesContext, useChatCallbacksContext, useSocketStatesContext} from '@context'
import {useBlogSelector, useChatActions} from '@redux'

import {CloseRoomButton} from '../../buttons'
import {ChatRoomUserObject, ChatListObject, ChatSubmitObject} from '../../objects'

import type {FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatRoomPart.scss'

type ChatRoomPartProps = DivCommonProps & {
  isChatRoomListOpen: boolean
}

export const ChatRoomPart: FC<ChatRoomPartProps> = ({className, isChatRoomListOpen, ...props}) => {
  const chatRoomOId = useBlogSelector(state => state.chat.chatRoomOId)
  const loadedChatRoomOId = useBlogSelector(state => state.chat.loadedChatRoomOId)

  const {resetChatArr, resetChatRoomOId, resetLoadedChatRoomOId, selectChatRoom} = useChatActions()

  const {socket} = useSocketStatesContext()
  const {userOId} = useAuthStatesContext()
  const {chatRoomOpened, loadChatArr} = useChatCallbacksContext()

  const onKeyDownChatRoom = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      resetChatRoomOId()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const _chatRoomOpened = useEffectEvent(() => {
    // socket 이랑 userOId 가 바뀔때마다 useEffect 실행되는걸 방지하고자 useEffectEvent 사용
    // chatRoomOpened 함수에서 서버에 채팅방 읽기 성공했다고 소켓 메시지를 보낸다
    if (socket && userOId) {
      chatRoomOpened(socket, chatRoomOId, userOId)
    }
  })

  // 초기화: 채팅방 설정
  useEffect(() => {
    if (chatRoomOId) {
      selectChatRoom(chatRoomOId)
    }
  }, [chatRoomOId])

  // 초기화: 채팅 불러오기
  useEffect(() => {
    const isChatRoomOpened = chatRoomOId.length > 0
    const isChatArrNotLoaded = chatRoomOId !== loadedChatRoomOId

    if (isChatRoomOpened && isChatArrNotLoaded) {
      loadChatArr(chatRoomOId, -1) // ::
        .then(res => {
          if (res.isSuccess) {
            _chatRoomOpened()
          }
        })
    }

    return () => {
      if (isChatRoomOpened && !isChatArrNotLoaded) {
        resetChatRoomOId()
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
