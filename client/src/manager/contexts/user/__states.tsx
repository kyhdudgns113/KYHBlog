import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const UserStatesContext = createContext<ContextType>({
  
})

export const useUserStatesContext = () => useContext(UserStatesContext)

export const UserStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <UserStatesContext.Provider value={value}>{children}</UserStatesContext.Provider>
}
