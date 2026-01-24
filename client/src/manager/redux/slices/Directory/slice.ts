import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface DirectoryState {
  directories: {[dirOId: string]: ST.DirectoryType}
  dirOId_addDir: string
  dirOId_addFile: string
  dirOId_editDir: string
  fileOId_editFile: string
  fileRows: {[fileOId: string]: LT.FileRowTypeLocal}
  moveDirOId: string
  moveFileOId: string
  rootDir: ST.DirectoryType
  rootDirOId: string
}

// 초기 상태
const initialState: DirectoryState = {
  directories: {},
  dirOId_addDir: '',
  dirOId_addFile: '',
  dirOId_editDir: '',
  fileOId_editFile: '',
  fileRows: {},
  moveDirOId: '',
  moveFileOId: '',
  rootDir: NV.NULL_DIR(),
  rootDirOId: ''
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    initDirectories: state => {
      state.directories = {}
    },
    initDirOId_addDir: state => {
      state.dirOId_addDir = ''
    },
    initDirOId_editDir: state => {
      state.dirOId_editDir = ''
    },
    initDirOId_addFile: state => {
      state.dirOId_addFile = ''
    },
    initFileOId_editFile: state => {
      state.fileOId_editFile = ''
    },
    initFileRows: state => {
      state.fileRows = {}
    },
    // ::
    resetMoveDirOId: state => {
      state.moveDirOId = ''
      state.moveFileOId = ''
    },
    resetMoveFileOId: state => {
      state.moveDirOId = ''
      state.moveFileOId = ''
    },
    // ::
    setDirOId_addDir: (state, action: PayloadAction<string>) => {
      state.dirOId_addDir = action.payload
    },
    setDirOId_addFile: (state, action: PayloadAction<string>) => {
      state.dirOId_addFile = action.payload
    },
    setDirOId_editDir: (state, action: PayloadAction<string>) => {
      state.dirOId_editDir = action.payload
    },
    setFileOId_editFile: (state, action: PayloadAction<string>) => {
      state.fileOId_editFile = action.payload
    },
    setMoveDirOId: (state, action: PayloadAction<string>) => {
      state.moveDirOId = action.payload
      state.moveFileOId = ''
    },
    setMoveFileOId: (state, action: PayloadAction<string>) => {
      state.moveDirOId = ''
      state.moveFileOId = action.payload
    },
    setRootDir: (state, action: PayloadAction<ST.DirectoryType>) => {
      state.rootDir = action.payload
    },
    setRootDirOId: (state, action: PayloadAction<string>) => {
      state.rootDirOId = action.payload
    },
    // ::
    writeExtraDirectory: (state, action: PayloadAction<ST.ExtraDirObjectType>) => {
      const {dirOIdsArr, directories} = action.payload
      dirOIdsArr.forEach(dirOId => {
        state.directories[dirOId] = directories[dirOId]
      })
    },
    writeExtraFileRow: (state, action: PayloadAction<ST.ExtraFileRowObjectType>) => {
      const {fileOIdsArr, fileRows} = action.payload
      fileOIdsArr.forEach(fileOId => {
        const fileRow = fileRows[fileOId]
        const {createdAt, updatedAt, ...rest} = fileRow
        state.fileRows[fileOId] = {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf(),
          updatedAtValue: new Date(updatedAt).valueOf()
        }
      })
    }
  }
})
