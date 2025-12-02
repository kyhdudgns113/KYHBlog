import {createContext, useCallback, useContext} from 'react'

import {useChatActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as SCK from '@socketType'
import * as T from '@type'
import * as U from '@util'

import type {APIReturnType} from '@type'

// prettier-ignore
type ContextType = {
  loadChatArr: (chatRoomOId: string, firstIdx: number) => Promise<APIReturnType>
  loadChatRoomArr: (userOId: string) => Promise<APIReturnType>
  loadUserChatRoom: (userOId: string, targetUserOId: string) => Promise<APIReturnType>

  submitChat: (socket: T.SocketType, chatRoomOId: string, content: string) => void
}
// prettier-ignore
export const ChatCallbacksContext = createContext<ContextType>({
  loadChatArr: () => Promise.resolve({isSuccess: false}),
  loadChatRoomArr: () => Promise.resolve({isSuccess: false}),
  loadUserChatRoom: () => Promise.resolve({isSuccess: false}),

  submitChat: () => {},
})

export const useChatCallbacksContext = () => useContext(ChatCallbacksContext)

export const ChatCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {pushFrontChatArr, setChatArr, setChatRoom, setChatRoomArr, setGoToBottom, setChatRoomOId, setLoadedChatRoomOId} = useChatActions()

  // GET AREA:

  const loadChatArr = useCallback((chatRoomOId: string, firstIdx: number) => {
    const url = `/client/chat/loadChatArr/${chatRoomOId}/${firstIdx}`

    return F.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          if (firstIdx === -1) {
            setChatArr(body.chatArr)
            setGoToBottom(true)
          } // ::
          else {
            pushFrontChatArr(body.chatArr)
          }
          setLoadedChatRoomOId(chatRoomOId)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChatRoomArr = useCallback((userOId: string) => {
    const url = `/client/chat/loadChatRoomArr/${userOId}`

    return F.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

        if (ok) {
          setChatRoomArr(body.chatRoomArr)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserChatRoom = useCallback(async (userOId: string, targetUserOId: string) => {
    /**
     * 채팅방의 정보만 가져온다
     *   - 채팅 리스트는 가져오지 않는다.
     */
    const url = `/client/chat/loadUserChatRoom/${userOId}/${targetUserOId}`

    return F.getWithJwt(url)
      .then(res => res.json())
      .then(res => {
        const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res // eslint-disable-line

        if (ok) {
          setChatRoom(body.chatRoom)
          setChatRoomOId(body.chatRoom.chatRoomOId)
          U.writeJwtFromServer(jwtFromServer)
          return {isSuccess: true}
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return {isSuccess: false}
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return {isSuccess: false}
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // SOCKET AREA:

  const submitChat = useCallback((socket: T.SocketType, chatRoomOId: string, content: string) => {
    if (socket && chatRoomOId && content.trim().length > 0) {
      const payload: SCK.ChatMessageType = {chatRoomOId, content}
      socket.emit('chat message', payload)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    loadChatArr,
    loadChatRoomArr,
    loadUserChatRoom,

    submitChat,
  }
  return <ChatCallbacksContext.Provider value={value}>{children}</ChatCallbacksContext.Provider>
}
