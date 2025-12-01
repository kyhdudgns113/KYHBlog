import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const QnAEffectsContext = createContext<ContextType>({})

export const useQnAEffectsContext = () => useContext(QnAEffectsContext)

export const QnAEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <QnAEffectsContext.Provider value={{}}>{children}</QnAEffectsContext.Provider>
}
