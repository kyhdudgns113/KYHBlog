import {DirectoryStatesProvider} from './__states'
import {DirectoryCallbacksProvider} from './_callbacks'
import {DirectoryEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const DirectoryProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <DirectoryStatesProvider>
      <DirectoryCallbacksProvider>
        <DirectoryEffectsProvider>{children}</DirectoryEffectsProvider>
      </DirectoryCallbacksProvider>
    </DirectoryStatesProvider>
  )
}
