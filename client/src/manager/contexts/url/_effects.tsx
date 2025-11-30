import {createContext, useContext, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {useTemplateActions} from '@redux'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const UrlEffectsContext = createContext<ContextType>({})

export const useUrlEffectsContext = () => useContext(UrlEffectsContext)

export const UrlEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {resetNowTab, setNowTab} = useTemplateActions()

  const location = useLocation()

  // 자동 변경: nowTab
  useEffect(() => {
    const pathParts = location.pathname.split('/main/')
    if (pathParts.length > 1) {
      const nowTab = pathParts[1].split('/')[0]
      if (['home', 'blog', 'qna', 'contact'].includes(nowTab)) {
        setNowTab(nowTab as 'home' | 'blog' | 'qna' | 'contact')
      } // ::
      else {
        resetNowTab()
      }
    } // ::
    else {
      resetNowTab()
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  //
  return <UrlEffectsContext.Provider value={{}}>{children}</UrlEffectsContext.Provider>
}
