import {createContext, useContext, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {useFileCallbacksContext} from './_callbacks'
import {useCommentActions, useFileActions, useFileStates} from '@redux'
import {useDirectoryCallbacksContext} from '@context'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const FileEffectsContext = createContext<ContextType>({})

export const useFileEffectsContext = () => useContext(FileEffectsContext)

export const FileEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {file, fileOId} = useFileStates()
  const {resetFile, resetFileContent, resetFileName, resetFileUser, setFileContent, setFileName} = useFileActions()
  const {resetCommentReplyArr} = useCommentActions()
  const {loadRootDirectory} = useDirectoryCallbacksContext()
  const {loadComments, loadFile, loadNoticeFile} = useFileCallbacksContext()

  const location = useLocation()

  // 초기화: file
  useEffect(() => {
    if (fileOId) {
      loadComments(fileOId)
      loadFile(fileOId)
    } // ::
    else {
      resetCommentReplyArr()
      resetFile()
      resetFileUser()
    }
  }, [fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 변경: fileContent, fileName
  useEffect(() => {
    if (fileOId) {
      setFileContent(file.content)
      setFileName(file.fileName)
    } // ::
    else {
      resetFileContent()
      resetFileName()
    }
  }, [file, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 로딩: 공지 파일
  useEffect(() => {
    // 주소창 /main/blog 뒤에 아무것도 없으면 공지파일 로드
    const isBlog = location.pathname.includes('/main/blog')
    if (isBlog && !location.pathname.split('/main/blog')[1]) {
      loadNoticeFile()
      loadRootDirectory()
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
