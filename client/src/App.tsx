import {Routes, Route} from 'react-router-dom'

import {Template} from './template'

import * as P from './pages'

import './base/styles/App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<P.RedirectMainPage />} />
      <Route path="/main/*" element={<Template />}>
        <Route index element={<P.NullPage />} />
      </Route>
    </Routes>
  )
}

export default App
