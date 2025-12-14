import {createContext, useContext, useEffect} from 'react'

import {useChatActions} from '@redux'

import {useAuthStatesContext} from '../auth'
import {useChatCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const ChatEffectsContext = createContext<ContextType>({})

export const useChatEffectsContext = () => useContext(ChatEffectsContext)

export const ChatEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {resetChatRoomArr} = useChatActions()

  const {userOId} = useAuthStatesContext()
  const {loadChatRoomArr} = useChatCallbacksContext()

  useEffect(() => {
    if (userOId) {
      loadChatRoomArr(userOId)
    } // ::
    else {
      resetChatRoomArr()
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps
  //
  return <ChatEffectsContext.Provider value={{}}>{children}</ChatEffectsContext.Provider>
}
