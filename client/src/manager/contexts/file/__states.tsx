import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const FileStatesContext = createContext<ContextType>({
  
})

export const useFileStatesContext = () => useContext(FileStatesContext)

export const FileStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <FileStatesContext.Provider value={value}>{children}</FileStatesContext.Provider>
}
