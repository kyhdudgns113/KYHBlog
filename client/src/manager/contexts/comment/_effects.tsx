import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const CommentEffectsContext = createContext<ContextType>({})

export const useCommentEffectsContext = () => useContext(CommentEffectsContext)

export const CommentEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  //
  return <CommentEffectsContext.Provider value={{}}>{children}</CommentEffectsContext.Provider>
}
