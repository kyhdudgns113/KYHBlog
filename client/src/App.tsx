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
        {/* 1. Home 영역 */}
        <Route path="home" element={<P.HomePage />} />

        {/* 2. Blog 영역 */}
        <Route path="blog/*">
          <Route index element={<P.BlogPage />} />
          <Route path=":fileOId" element={<P.BlogReadingPage reqAuth={SV.AUTH_GUEST} />} />
        </Route>

        {/* 3. QnA 영역 */}
        <Route path="qna/*">
          <Route index element={<P.QnAPage />} />
          <Route path="write" element={<P.QnAWritePage reqAuth={SV.AUTH_USER} />} />
          <Route path="read/*" element={<P.QnAReadPage reqAuth={SV.AUTH_GUEST} />} />
        </Route>

        {/* 4. Contact 영역 */}
        <Route path="contact" element={<P.ContactPage />} />

        {/* 5. Admin 영역 */}
        <Route path="admin/*" element={<C.AdminProvider reqAuth={SV.AUTH_ADMIN} />}>
          <Route index element={<P.AdminPage />} />
          <Route path="posting/*" element={<P.AdminPostingPage />} />
          <Route path="users" element={<P.AdminUsersPage />} />
          <Route path="logs" element={<P.AdminLogsPage />} />
          <Route path="*" element={<P.NullPage />} />
        </Route>
        <Route path="*" element={<P.NullPage />} />
      </Route>
      <Route path="*" element={<P.NullPage />} />
    </Routes>
  )
}

export default App
