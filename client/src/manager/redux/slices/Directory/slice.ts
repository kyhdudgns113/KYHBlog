import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface DirectoryState {
  directories: {[dirOId: string]: ST.DirectoryType}
  dirOId_addDir: string
  dirOId_addFile: string
  fileRows: {[fileOId: string]: ST.FileRowType}
  rootDir: ST.DirectoryType
  rootDirOId: string
}

// 초기 상태
const initialState: DirectoryState = {
  directories: {},
  dirOId_addDir: '',
  dirOId_addFile: '',
  fileRows: {},
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
    initDirOId_addFile: state => {
      state.dirOId_addFile = ''
    },
    initFileRows: state => {
      state.fileRows = {}
    },
    // ::
    setDirOId_addDir: (state, action: PayloadAction<string>) => {
      state.dirOId_addDir = action.payload
    },
    setDirOId_addFile: (state, action: PayloadAction<string>) => {
      state.dirOId_addFile = action.payload
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
        state.fileRows[fileOId] = fileRows[fileOId]
      })
    }
  }
})
