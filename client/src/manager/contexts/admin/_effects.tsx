import {useAdminCallbacksContext} from '@context'
import {useAdminActions, useAdminStates} from '@redux'
import {createContext, useContext, useEffect} from 'react'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const AdminEffectsContext = createContext<ContextType>({})

export const useAdminEffectsContext = () => useContext(AdminEffectsContext)

export const AdminEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userArr} = useAdminStates()
  const {setIsLoadingLogArr, setIsLoadingUserArr, setUserArrFiltered} = useAdminActions()

  const {loadLogArr, loadUserArr} = useAdminCallbacksContext()

  /**
   * 페이지 로딩시
   *
   * 1. userArr 불러오기
   * 2. logArr 불러오기
   */
  useEffect(() => {
    // 1. userArr 불러오기
    loadUserArr(false) // ::
      .then(ok => {
        if (ok) {
          setIsLoadingUserArr(false)
        } // ::
        else {
          setIsLoadingUserArr(null)
        }
      })

    // 2. logArr 불러오기
    loadLogArr(false) // ::
      .then(ok => {
        if (ok) {
          setIsLoadingLogArr(false)
        } // ::
        else {
          setIsLoadingLogArr(null)
        }
      })

    return () => {
      setIsLoadingUserArr(true)
      setIsLoadingLogArr(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: userArrFiltered 초기화
  useEffect(() => {
    setUserArrFiltered(userArr)
  }, [userArr]) // eslint-disable-line react-hooks/exhaustive-deps

  //
  return <AdminEffectsContext.Provider value={{}}>{children}</AdminEffectsContext.Provider>
}
