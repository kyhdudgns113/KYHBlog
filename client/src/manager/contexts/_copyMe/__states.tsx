import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const CopyMeStatesContext = createContext<ContextType>({
  
})

export const useCopyMeStatesContext = () => useContext(CopyMeStatesContext)

export const CopyMeStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <CopyMeStatesContext.Provider value={value}>{children}</CopyMeStatesContext.Provider>
}
