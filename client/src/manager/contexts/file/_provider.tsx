import {FileStatesProvider} from './__states'
import {FileCallbacksProvider} from './_callbacks'
import {FileEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const FileProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <FileStatesProvider>
      <FileCallbacksProvider>
        <FileEffectsProvider>{children}</FileEffectsProvider>
      </FileCallbacksProvider>
    </FileStatesProvider>
  )
}
