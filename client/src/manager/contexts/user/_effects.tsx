import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const UserEffectsContext = createContext<ContextType>({})

export const useUserEffectsContext = () => useContext(UserEffectsContext)

export const UserEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <UserEffectsContext.Provider value={{}}>{children}</UserEffectsContext.Provider>
}
