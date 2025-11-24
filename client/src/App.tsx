import {Routes, Route} from 'react-router-dom'

import {Template} from './template'

import * as C from '@context'
import * as P from './pages'
import * as SV from '@shareValue'

import './base/styles/App.css'
import './base/styles/App.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<P.RedirectHomePage />} />
      <Route path="/main/*" element={<Template />}>
        <Route path="home" element={<P.HomePage />} />

        <Route path="blog/*">
          <Route index element={<P.BlogPage />} />
          <Route path=":fileOId" element={<P.BlogReadingPage />} />
        </Route>

        <Route path="qna" element={<P.QnAPage />} />

        <Route path="contact" element={<P.ContactPage />} />

        <Route path="admin/*" element={<C.AdminProvider reqAuth={SV.AUTH_ADMIN} />}>
          <Route index element={<P.AdminPage />} />
          <Route path="posting/*" element={<P.AdminPostingPage />} />
        </Route>
        {/* <Route index element={<P.MainPage />} />
        <Route path="admin/*" element={<C.AdminProvider reqAuth={SV.AUTH_ADMIN} />}>
          <Route index element={<P.AdminPage />} />
          <Route path="users" element={<P.AdminUsersPage />} />
          <Route path="logs" element={<P.AdminLogsPage />} />
        </Route>
        <Route path="reading/*" element={<P.ReadingPage reqAuth={SV.AUTH_GUEST} />} />
        <Route path="posting/*" element={<P.PostingPage reqAuth={SV.AUTH_ADMIN} />} /> */}
        <Route path="*" element={<P.NullPage />} />
      </Route>
      <Route path="*" element={<P.NullPage />} />
    </Routes>
  )
}

export default App
