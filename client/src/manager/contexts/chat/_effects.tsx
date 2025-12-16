import {createContext, useContext, useEffect, useEffectEvent} from 'react'

import {useBlogSelector, useChatActions} from '@redux'

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
  // const {chatQueue, chatRoomOId, loadedChatRoomOId} = useChatStates()
  const chatQueue = useBlogSelector(state => state.chat.chatQueue)
  const chatRoomOId = useBlogSelector(state => state.chat.chatRoomOId)
  const loadedChatRoomOId = useBlogSelector(state => state.chat.loadedChatRoomOId)
  const {clearChatRoomUnreadMsgCnt, setChatRoomUnreadMsgCnt, moveChatQueueToChatArr, pushBackChatQueue, pushFrontChatRoomArr, resetChatRoomArr} =
    useChatActions()

  const {socket} = useSocketStatesContext()
  const {userOId} = useAuthStatesContext()
  const {loadChatRoomArr} = useChatCallbacksContext()

  // AREA1: 소켓 리스너 영역

  const _chatRoomOpened = useEffectEvent(() => {
    if (socket) {
      socket.on('chatRoom opened', (payload: SCK.ChatRoomOpenedType) => {
        const {chatRoomOId} = payload
        clearChatRoomUnreadMsgCnt(chatRoomOId)
      })
    }
  })

  const _newChat = useEffectEvent(() => {
    if (socket) {
      socket.on('new chat', (payload: SCK.NewChatType) => {
        pushBackChatQueue([payload])
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

  const _refreshChatRoom = useEffectEvent(() => {
    if (socket) {
      socket.on('refresh chat room', (payload: SCK.RefreshChatRoomType) => {
        setChatRoomUnreadMsgCnt(payload)
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
    /**
     * - socket 이 null 이 아닐때 부착해야 하므로 dependency array 에 socket 이 있는건 맞다.
     * - 다음 이유로 이벤트 리스너는 useEffectEvent 로 선언한다.
     *   - 이벤트 리스너마다 사용하는 state 가 있다
     *     - 이 state 가 변할때마다 이벤트 리스너를 부착하면 오버헤드가 심해진다
     *   - 이벤트 리스너를 별도의 코드로 관리하는게 좋다
     */
    if (socket) {
      _chatRoomOpened()
      _newChat()
      _newChatRoom()
      _refreshChatRoom()
    }
  }, [socket])

  // 자동 변경: chatQueue 에서 chatArr 로
  useEffect(() => {
    const isChatRoomOpened = chatRoomOId
    const isChatArrLoaded = chatRoomOId === loadedChatRoomOId
    const isChatQueueNotEmpty = chatQueue.length > 0

    if (isChatRoomOpened && isChatArrLoaded && isChatQueueNotEmpty) {
      moveChatQueueToChatArr()
    }
  }, [chatQueue, chatRoomOId, loadedChatRoomOId])

  return <ChatEffectsContext.Provider value={{}}>{children}</ChatEffectsContext.Provider>
}
