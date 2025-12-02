import {QnAStatesProvider} from './__states'
import {QnACallbacksProvider} from './_callbacks'
import {QnAEffectsProvider} from './_effects'

import type {FC, PropsWithChildren} from 'react'

export const QnAProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <QnAStatesProvider>
      <QnACallbacksProvider>
        <QnAEffectsProvider>{children}</QnAEffectsProvider>
      </QnACallbacksProvider>
    </QnAStatesProvider>
  )
}
