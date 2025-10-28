import {ChatStatesProvider} from './__states'
import {ChatCallbacksProvider} from './_callbacks'
import {ChatEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const ChatProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ChatStatesProvider>
      <ChatCallbacksProvider>
        <ChatEffectsProvider>{children}</ChatEffectsProvider>
      </ChatCallbacksProvider>
    </ChatStatesProvider>
  )
}
