import {UrlStatesProvider} from './__states'
import {UrlCallbacksProvider} from './_callbacks'
import {UrlEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const UrlProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <UrlStatesProvider>
      <UrlCallbacksProvider>
        <UrlEffectsProvider>{children}</UrlEffectsProvider>
      </UrlCallbacksProvider>
    </UrlStatesProvider>
  )
}
