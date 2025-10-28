import {createContext, useContext, useEffect} from 'react'

import {useFileCallbacksContext} from './_callbacks'
import {useFileActions, useFileState} from '@redux'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const FileEffectsContext = createContext<ContextType>({})

export const useFileEffectsContext = () => useContext(FileEffectsContext)

export const FileEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {file, fileOId} = useFileState()
  const {resetCommentReplyArr, resetFile, resetFileContent, resetFileName, resetFileUser, setFileContent, setFileName} = useFileActions()
  const {loadComments, loadFile} = useFileCallbacksContext()

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

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
