import {createContext, useContext, useState} from 'react'

import {AUTH_GUEST} from '@shareValue'

import type {FC, PropsWithChildren} from 'react'
import type {Setter} from '@type'

// prettier-ignore
type ContextType = {
  isLoggedIn: boolean, setIsLoggedIn: Setter<boolean>
  picture: string, setPicture: Setter<string>
  userAuth: number, setUserAuth: Setter<number>
  userId: string, setUserId: Setter<string>
  userMail: string, setUserMail: Setter<string>
  userName: string, setUserName: Setter<string>
  userOId: string, setUserOId: Setter<string>
}
// prettier-ignore
export const AuthStatesContext = createContext<ContextType>({
  isLoggedIn: false, setIsLoggedIn: () => {},
  picture: '', setPicture: () => {},
  userAuth: 0, setUserAuth: () => {},
  userId: '', setUserId: () => {},
  userMail: '', setUserMail: () => {},
  userName: '', setUserName: () => {},
  userOId: '', setUserOId: () => {}
})

export const useAuthStatesContext = () => useContext(AuthStatesContext)

export const AuthStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [picture, setPicture] = useState<string>('')
  const [userAuth, setUserAuth] = useState<number>(AUTH_GUEST)
  const [userId, setUserId] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userOId, setUserOId] = useState<string>('')

  // prettier-ignore
  const value: ContextType = {
    isLoggedIn, setIsLoggedIn,
    picture, setPicture,
    userAuth, setUserAuth,
    userId, setUserId,
    userMail, setUserMail,
    userName, setUserName,
    userOId, setUserOId
  }

  return <AuthStatesContext.Provider value={value}>{children}</AuthStatesContext.Provider>
}
