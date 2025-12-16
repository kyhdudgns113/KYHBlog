import {createContext, useContext, useEffect, useEffectEvent} from 'react'

import {useChatActions, useChatStates} from '@redux'

import {useAuthStatesContext} from '../auth'
import {useSocketStatesContext} from '../socket'
import {useChatCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

import * as SCK from '@socketType'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const ChatEffectsContext = createContext<ContextType>({})

export const useChatEffectsContext = () => useContext(ChatEffectsContext)

export const ChatEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {chatQueue, chatRoomOId, loadedChatRoomOId} = useChatStates()
  const {clearChatRoomUnreadMsgCnt, moveChatQueueToChatArr, pushBackChatQueue, pushFrontChatRoomArr, resetChatRoomArr} = useChatActions()

  const {socket} = useSocketStatesContext()
  const {userOId} = useAuthStatesContext()
  const {loadChatRoomArr} = useChatCallbacksContext()

  // AREA1: 소켓 리스너 영역

  const _chatMessage = useEffectEvent(() => {
    if (socket) {
      socket.on('chat message', (payload: SCK.NewChatType) => {
        pushBackChatQueue([payload])
      })
    }
  })

  const _chatRoomOpened = useEffectEvent(() => {
    if (socket) {
      socket.on('chatRoom opened', (payload: SCK.ChatRoomOpenedType) => {
        const {chatRoomOId} = payload
        clearChatRoomUnreadMsgCnt(chatRoomOId)
      })
    }
  })

  const _newChatRoom = useEffectEvent(() => {
    if (socket) {
      socket.on('new chat room', (payload: SCK.NewChatRoomCreatedType) => {
        pushFrontChatRoomArr(payload)
      })
    }
  })

  // AREA2: useEffect 영역

  // 초기화: 로그인시 채팅방 목록 불러오기
  useEffect(() => {
    if (userOId) {
      loadChatRoomArr(userOId)
    } // ::
    else {
      resetChatRoomArr()
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: 소켓 이벤트 리스너 부착
  useEffect(() => {
    if (socket) {
      _chatMessage()
      _chatRoomOpened()
      _newChatRoom()
    }
  }, [socket])

  // 자동 변경: chatQueue 에서 chatArr 로
  useEffect(() => {
    if (chatRoomOId && chatRoomOId === loadedChatRoomOId && chatQueue.length > 0) {
      moveChatQueueToChatArr()
    }
  }, [chatQueue, chatRoomOId, loadedChatRoomOId])

  return <ChatEffectsContext.Provider value={{}}>{children}</ChatEffectsContext.Provider>
}
