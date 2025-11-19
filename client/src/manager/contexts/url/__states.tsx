import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const UrlStatesContext = createContext<ContextType>({
  
})

export const useUrlStatesContext = () => useContext(UrlStatesContext)

export const UrlStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <UrlStatesContext.Provider value={value}>{children}</UrlStatesContext.Provider>
}
