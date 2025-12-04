import {createContext, useContext} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const QnAEffectsContext = createContext<ContextType>({})

export const useQnAEffectsContext = () => useContext(QnAEffectsContext)

export const QnAEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  // qnARowArr 는 여기서 불러오지 않는다.
  // - qna 페이지 로딩시에만 불러오도록 한다.

  return <QnAEffectsContext.Provider value={{}}>{children}</QnAEffectsContext.Provider>
}
