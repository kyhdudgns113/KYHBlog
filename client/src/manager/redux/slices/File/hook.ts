import {useBlogSelector, useBlogDispatch} from '@redux'
import {fileSlice} from './slice'

import * as ST from '@shareType'

export const useFileStates = () => useBlogSelector(state => state.file)

export const useFileActions = () => {
  const dispatch = useBlogDispatch()

  return {
    offDeleteFile: () => dispatch(fileSlice.actions.offDeleteFile()),
    onDeleteFile: () => dispatch(fileSlice.actions.onDeleteFile()),
    // ::
    resetFile: () => dispatch(fileSlice.actions.resetFile()),
    resetFileContent: () => dispatch(fileSlice.actions.resetFileContent()),
    resetFileName: () => dispatch(fileSlice.actions.resetFileName()),
    resetFileOId: () => dispatch(fileSlice.actions.resetFileOId()),
    resetFileUser: () => dispatch(fileSlice.actions.resetFileUser()),
    // ::
    selectFileUser: () => dispatch(fileSlice.actions.selectFileUser()),
    setFile: (file: ST.FileType) => dispatch(fileSlice.actions.setFile(file)),
    setFileContent: (fileContent: string) => dispatch(fileSlice.actions.setFileContent(fileContent)),
    setFileName: (fileName: string) => dispatch(fileSlice.actions.setFileName(fileName)),
    setFileOId: (fileOId: string) => dispatch(fileSlice.actions.setFileOId(fileOId)),
    setFileUser: (fileUser: ST.UserType) => dispatch(fileSlice.actions.setFileUser(fileUser)),
    // ::
    unselectFileUser: () => dispatch(fileSlice.actions.unselectFileUser())
  }
}
