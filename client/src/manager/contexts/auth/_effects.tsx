import {createContext, useContext, useEffect} from 'react'

import {AUTH_GUEST} from '@shareValue'

import {useAuthCallbacksContext} from './_callbacks'
import {useAuthStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const AuthEffectsContext = createContext<ContextType>({})

export const useAuthEffectsContext = () => useContext(AuthEffectsContext)

export const AuthEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {userOId, setIsLoggedIn} = useAuthStatesContext()
  const {refreshToken} = useAuthCallbacksContext()

  useEffect(() => {
    refreshToken(AUTH_GUEST)
  }, [refreshToken])

  // 초기화: isLoggedIn: 유저 로그인 상태
  useEffect(() => {
    if (userOId) {
      setIsLoggedIn(true)
    } // ::
    else {
      setIsLoggedIn(false)
    }
  }, [userOId]) // eslint-disable-line react-hooks/exhaustive-deps

  //
  return <AuthEffectsContext.Provider value={{}}>{children}</AuthEffectsContext.Provider>
}
