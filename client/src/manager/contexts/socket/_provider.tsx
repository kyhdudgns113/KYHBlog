import {SocketStatesProvider} from './__states'
import {SocketCallbacksProvider} from './_callbacks'
import {SocketEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const SocketProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <SocketStatesProvider>
      <SocketCallbacksProvider>
        <SocketEffectsProvider>{children}</SocketEffectsProvider>
      </SocketCallbacksProvider>
    </SocketStatesProvider>
  )
}
