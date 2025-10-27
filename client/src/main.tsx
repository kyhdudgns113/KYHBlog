import {BrowserRouter} from 'react-router-dom'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'

import {store} from '@redux'

import App from './App.tsx'

import * as C from '@context'

import './base/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <C.AuthProvider>
        <C.DirectoryProvider>
          <App />
        </C.DirectoryProvider>
      </C.AuthProvider>
    </Provider>
  </BrowserRouter>
)
