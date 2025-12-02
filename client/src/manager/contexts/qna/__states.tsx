import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const QnAStatesContext = createContext<ContextType>({
  
})

export const useQnAStatesContext = () => useContext(QnAStatesContext)

export const QnAStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <QnAStatesContext.Provider value={value}>{children}</QnAStatesContext.Provider>
}
