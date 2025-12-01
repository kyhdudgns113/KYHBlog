import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const QnACallbacksContext = createContext<ContextType>({
  
})

export const useQnACallbacksContext = () => useContext(QnACallbacksContext)

export const QnACallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }
  return <QnACallbacksContext.Provider value={value}>{children}</QnACallbacksContext.Provider>
}
