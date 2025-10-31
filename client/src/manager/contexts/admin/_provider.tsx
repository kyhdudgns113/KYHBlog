import {Outlet} from 'react-router-dom'

import {CheckAuth} from '@guard'

import {AdminStatesProvider} from './__states'
import {AdminCallbacksProvider} from './_callbacks'
import {AdminEffectsProvider} from './_effects'

import type {FC} from 'react'

type AdminProviderProps = {
  reqAuth: number
}

export const AdminProvider: FC<AdminProviderProps> = ({reqAuth}) => {
  return (
    <CheckAuth reqAuth={reqAuth}>
      <AdminStatesProvider>
        <AdminCallbacksProvider>
          <AdminEffectsProvider>
            <Outlet />
          </AdminEffectsProvider>
        </AdminCallbacksProvider>
      </AdminStatesProvider>
    </CheckAuth>
  )
}
