import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const SocketEffectsContext = createContext<ContextType>({})

export const useSocketEffectsContext = () => useContext(SocketEffectsContext)

export const SocketEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <SocketEffectsContext.Provider value={{}}>{children}</SocketEffectsContext.Provider>
}
