import {CommentStatesProvider} from './__states'
import {CommentCallbacksProvider} from './_callbacks'
import {CommentEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const CommentProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <CommentStatesProvider>
      <CommentCallbacksProvider>
        <CommentEffectsProvider>{children}</CommentEffectsProvider>
      </CommentCallbacksProvider>
    </CommentStatesProvider>
  )
}
