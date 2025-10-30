import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  
}
// prettier-ignore
export const CommentStatesContext = createContext<ContextType>({
  
})

export const useCommentStatesContext = () => useContext(CommentStatesContext)

export const CommentStatesProvider: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const value: ContextType = {
    
  }

  return <CommentStatesContext.Provider value={value}>{children}</CommentStatesContext.Provider>
}
