import {useBlogSelector, useBlogDispatch} from '@redux'
import {directorySlice} from './slice'

import * as LT from '@localizeType'
import * as ST from '@shareType'

export const useDirectoryStates = () => useBlogSelector(state => state.directory)

export const useDirectoryActions = () => {
  const dispatch = useBlogDispatch()

  return {
    initDirectories: () => dispatch(directorySlice.actions.initDirectories()),
    initDirOId_addDir: () => dispatch(directorySlice.actions.initDirOId_addDir()),
    initDirOId_addFile: () => dispatch(directorySlice.actions.initDirOId_addFile()),
    initDirOId_editDir: () => dispatch(directorySlice.actions.initDirOId_editDir()),
    initFileOId_editFile: () => dispatch(directorySlice.actions.initFileOId_editFile()),
    initFileRows: () => dispatch(directorySlice.actions.initFileRows()),
    // ::
    resetMoveDirOId: () => dispatch(directorySlice.actions.resetMoveDirOId()),
    resetMoveFileOId: () => dispatch(directorySlice.actions.resetMoveFileOId()),
    // ::
    setDirOId_addDir: (dirOId_addDir: string) => dispatch(directorySlice.actions.setDirOId_addDir(dirOId_addDir)),
    setDirOId_addFile: (dirOId_addFile: string) => dispatch(directorySlice.actions.setDirOId_addFile(dirOId_addFile)),
    setDirOId_editDir: (dirOId_editDir: string) => dispatch(directorySlice.actions.setDirOId_editDir(dirOId_editDir)),
    setFileOId_editFile: (fileOId_editFile: string) => dispatch(directorySlice.actions.setFileOId_editFile(fileOId_editFile)),
    setMoveDirOId: (moveDirOId: string) => dispatch(directorySlice.actions.setMoveDirOId(moveDirOId)),
    setMoveFileOId: (moveFileOId: string) => dispatch(directorySlice.actions.setMoveFileOId(moveFileOId)),
    setRootDir: (rootDir: LT.DirectoryTypeLocal) => dispatch(directorySlice.actions.setRootDir(rootDir)),
    setRootDirOId: (rootDirOId: string) => dispatch(directorySlice.actions.setRootDirOId(rootDirOId)),
    // ::
    writeExtraDirectory: (extraDir: ST.ExtraDirObjectType) => dispatch(directorySlice.actions.writeExtraDirectory(extraDir)),
    writeExtraFileRow: (extraFileRow: ST.ExtraFileRowObjectType) => dispatch(directorySlice.actions.writeExtraFileRow(extraFileRow)),
  }
}

export const useSelectDirectory = (dirOId: string) => useBlogSelector(state => state.directory.directories[dirOId])
export const useSelectFileRow = (fileOId: string) => useBlogSelector(state => state.directory.fileRows[fileOId])
