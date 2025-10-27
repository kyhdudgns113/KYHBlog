import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const DirectoryEffectsContext = createContext<ContextType>({})

export const useDirectoryEffectsContext = () => useContext(DirectoryEffectsContext)

export const DirectoryEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <DirectoryEffectsContext.Provider value={{}}>{children}</DirectoryEffectsContext.Provider>
}
