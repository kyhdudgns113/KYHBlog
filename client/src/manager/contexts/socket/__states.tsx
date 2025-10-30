import {createContext, useContext, useState} from 'react'

import type {Setter, SocketType} from '@type'
import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  socket: SocketType, setSocket: Setter<SocketType>
}
// prettier-ignore
export const SocketStatesContext = createContext<ContextType>({
  socket: null, setSocket: () => {}
})

export const useSocketStatesContext = () => useContext(SocketStatesContext)

export const SocketStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [socket, setSocket] = useState<SocketType>(null)

  // prettier-ignore
  const value: ContextType = {
    socket, setSocket
  }

  return <SocketStatesContext.Provider value={value}>{children}</SocketStatesContext.Provider>
}
