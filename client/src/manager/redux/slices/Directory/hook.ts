import {useBlogSelector, useBlogDispatch} from '@redux'
import {directorySlice} from './slice'

import * as ST from '@shareType'

export const useDirectoryStates = () => useBlogSelector(state => state.directory)

export const useDirectoryActions = () => {
  const dispatch = useBlogDispatch()

  return {
    initDirectories: () => dispatch(directorySlice.actions.initDirectories()),
    initFileRows: () => dispatch(directorySlice.actions.initFileRows()),
    setRootDir: (rootDir: ST.DirectoryType) => dispatch(directorySlice.actions.setRootDir(rootDir)),
    setRootDirOId: (rootDirOId: string) => dispatch(directorySlice.actions.setRootDirOId(rootDirOId)),
    writeExtraDirectory: (extraDir: ST.ExtraDirObjectType) => dispatch(directorySlice.actions.writeExtraDirectory(extraDir)),
    writeExtraFileRow: (extraFileRow: ST.ExtraFileRowObjectType) => dispatch(directorySlice.actions.writeExtraFileRow(extraFileRow))
  }
}

export const useSelectedDirectory = (dirOId: string) => useBlogSelector(state => state.directory.directories[dirOId])
export const useSelectedFileRow = (fileOId: string) => useBlogSelector(state => state.directory.fileRows[fileOId])
