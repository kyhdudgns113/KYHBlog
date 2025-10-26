import {CopyMeStatesProvider} from './__states'
import {CopyMeCallbacksProvider} from './_callbacks'
import {CopyMeEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const CopyMeProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <CopyMeStatesProvider>
      <CopyMeCallbacksProvider>
        <CopyMeEffectsProvider>{children}</CopyMeEffectsProvider>
      </CopyMeCallbacksProvider>
    </CopyMeStatesProvider>
  )
}
