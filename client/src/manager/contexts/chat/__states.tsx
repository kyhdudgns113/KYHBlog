import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const ChatStatesContext = createContext<ContextType>({
  
})

export const useChatStatesContext = () => useContext(ChatStatesContext)

export const ChatStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <ChatStatesContext.Provider value={value}>{children}</ChatStatesContext.Provider>
}
