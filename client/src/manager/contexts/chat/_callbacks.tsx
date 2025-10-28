import {createContext, useCallback, useContext} from 'react'

import {useChatActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

import * as F from '@fetch'
import * as U from '@util'

// prettier-ignore
type ContextType = {
  
  loadUserChatRoom: (userOId: string, targetUserOId: string) => Promise<boolean>
}
// prettier-ignore
export const ChatCallbacksContext = createContext<ContextType>({
  loadUserChatRoom: () => Promise.resolve(false)
})

export const useChatCallbacksContext = () => useContext(ChatCallbacksContext)

export const ChatCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setChatRoomOId} = useChatActions()

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
          setChatRoomOId(body.chatRoom.chatRoomOId)
          U.writeJwtFromServer(jwtFromServer)
          return true
        } // ::
        else {
          U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          return false
        }
      })
      .catch(errObj => {
        U.alertErrors(url, errObj)
        return false
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // prettier-ignore
  const value: ContextType = {
    loadUserChatRoom
  }
  return <ChatCallbacksContext.Provider value={value}>{children}</ChatCallbacksContext.Provider>
}
