import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const UrlCallbacksContext = createContext<ContextType>({
  
})

export const useUrlCallbacksContext = () => useContext(UrlCallbacksContext)

export const UrlCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }
  return <UrlCallbacksContext.Provider value={value}>{children}</UrlCallbacksContext.Provider>
}
