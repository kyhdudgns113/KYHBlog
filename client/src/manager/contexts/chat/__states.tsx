import {createContext, useContext, useRef} from 'react'

import type {FC, PropsWithChildren, RefObject} from 'react'

// prettier-ignore
type ContextType = {
  chatAreaRef: RefObject<HTMLDivElement | null>
}
// prettier-ignore
export const ChatStatesContext = createContext<ContextType>({
  chatAreaRef: {current: null}
})

export const useChatStatesContext = () => useContext(ChatStatesContext)

export const ChatStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const chatAreaRef = useRef<HTMLDivElement | null>(null)

  // prettier-ignore
  const value: ContextType = {
    chatAreaRef
  }

  return <ChatStatesContext.Provider value={value}>{children}</ChatStatesContext.Provider>
}
