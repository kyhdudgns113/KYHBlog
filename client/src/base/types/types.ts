import type {Dispatch, SetStateAction} from 'react'
import type {Socket} from 'socket.io-client'

export type AuthBodyType = {
  jwtFromServer: string
  picture?: string
  userAuth: number
  userId: string
  userMail: string
  userName: string
  userOId: string
}
export type CallbackType = () => void
export type LockType = {nowNumber: number; maxNumber: number}
export type Setter<T> = Dispatch<SetStateAction<T>>
export type SocketType = typeof Socket | null

export type HeaderBtnClickedType = 'logIn' | 'signUp' | null
export type NowTabType = 'home' | 'blog' | 'qna' | 'contact' | null
