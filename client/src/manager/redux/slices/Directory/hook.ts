import {useBlogSelector, useBlogDispatch} from '@redux'
import {directorySlice} from './slice'

import * as ST from '@shareType'

export const useDirectoryStates = () => useBlogSelector(state => state.directory)

export const useDirectoryActions = () => {
  const dispatch = useBlogDispatch()

  return {
    initDirectories: () => dispatch(directorySlice.actions.initDirectories()),
    initDirOId_addDir: () => dispatch(directorySlice.actions.initDirOId_addDir()),
    initDirOId_addFile: () => dispatch(directorySlice.actions.initDirOId_addFile()),
    initFileRows: () => dispatch(directorySlice.actions.initFileRows()),
    // ::
    setDirOId_addDir: (dirOId_addDir: string) => dispatch(directorySlice.actions.setDirOId_addDir(dirOId_addDir)),
    setDirOId_addFile: (dirOId_addFile: string) => dispatch(directorySlice.actions.setDirOId_addFile(dirOId_addFile)),
    setRootDir: (rootDir: ST.DirectoryType) => dispatch(directorySlice.actions.setRootDir(rootDir)),
    setRootDirOId: (rootDirOId: string) => dispatch(directorySlice.actions.setRootDirOId(rootDirOId)),
    // ::
    writeExtraDirectory: (extraDir: ST.ExtraDirObjectType) => dispatch(directorySlice.actions.writeExtraDirectory(extraDir)),
    writeExtraFileRow: (extraFileRow: ST.ExtraFileRowObjectType) => dispatch(directorySlice.actions.writeExtraFileRow(extraFileRow))
  }
}

export const useSelectDirectory = (dirOId: string) => useBlogSelector(state => state.directory.directories[dirOId])
export const useSelectFileRow = (fileOId: string) => useBlogSelector(state => state.directory.fileRows[fileOId])
