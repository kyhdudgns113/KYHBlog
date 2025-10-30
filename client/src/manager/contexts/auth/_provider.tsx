import {AuthStatesProvider} from './__states'
import {AuthCallbacksProvider} from './_callbacks'
import {AuthEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const AuthProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <AuthStatesProvider>
      <AuthCallbacksProvider>
        <AuthEffectsProvider>{children}</AuthEffectsProvider>
      </AuthCallbacksProvider>
    </AuthStatesProvider>
  )
}
