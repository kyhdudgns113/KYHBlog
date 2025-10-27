import {useBlogSelector, useBlogDispatch} from '@redux'
import {directorySlice} from './slice'

export const useDirectoryState = () => useBlogSelector(state => state.directory)

export const useDirectoryActions = () => {
  const dispatch = useBlogDispatch()

  return {
    initDirectories: () => dispatch(directorySlice.actions.initDirectories())
  }
}

export const useSelectedDirectory = (dirOId: string) => useBlogSelector(state => state.directory.directories[dirOId])
export const useSelectedFileRow = (fileOId: string) => useBlogSelector(state => state.directory.fileRows[fileOId])
