import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const AdminStatesContext = createContext<ContextType>({
  
})

export const useAdminStatesContext = () => useContext(AdminStatesContext)

export const AdminStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <AdminStatesContext.Provider value={value}>{children}</AdminStatesContext.Provider>
}
