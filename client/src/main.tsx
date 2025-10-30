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
      <C.SocketProvider>
        <C.AuthProvider>
          <C.UserProvider>
            <C.ChatProvider>
              <C.DirectoryProvider>
                <C.FileProvider>
                  <C.CommentProvider>
                    <App />
                  </C.CommentProvider>
                </C.FileProvider>
              </C.DirectoryProvider>
            </C.ChatProvider>
          </C.UserProvider>
        </C.AuthProvider>
      </C.SocketProvider>
    </Provider>
  </BrowserRouter>
)
