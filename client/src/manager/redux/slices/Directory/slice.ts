import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as ST from '@shareType'

// State 타입 정의
interface DirectoryState {
  directories: {[dirOId: string]: ST.DirectoryType}
  fileRows: {[fileOId: string]: ST.FileRowType}
}

// 초기 상태
const initialState: DirectoryState = {
  directories: {},
  fileRows: {}
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    initDirectories: state => {
      state.directories = {}
    },
    initFileRows: state => {
      state.fileRows = {}
    },
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
