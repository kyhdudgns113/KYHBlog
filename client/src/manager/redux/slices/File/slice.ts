import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface FileState {
  file: LT.FileTypeLocal // 현재 열려있는 파일
  fileContent: string // 수정중인 파일의 내용
  fileName: string // 수정중인 파일의 이름
  fileOId: string // 현재 열려있는 파일의 OId
  fileUser: LT.UserTypeLocal // 현재 열려있는 파일의 작성자
  isDelete: boolean // 현재 열려있는 파일을 삭제할지 여부
  isFileUserSelected: boolean // 현재 열려있는 파일의 작성자가 선택되었는지 여부
}

// 초기 상태
const initialState: FileState = {
  file: NV.NULL_FILE(),
  fileContent: '',
  fileName: '',
  fileOId: '',
  fileUser: NV.NULL_USER(),
  isDelete: false,
  isFileUserSelected: false
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    offDeleteFile: state => {
      state.isDelete = false
    },
    onDeleteFile: state => {
      state.isDelete = true
    },

    resetFile: state => {
      state.file = NV.NULL_FILE()
    },
    resetFileContent: state => {
      state.fileContent = ''
    },
    resetFileName: state => {
      state.fileName = ''
    },
    resetFileOId: state => {
      state.fileOId = ''
    },
    resetFileUser: state => {
      state.fileUser = NV.NULL_USER()
    },

    // ::
    selectFileUser: state => {
      state.isFileUserSelected = true
    },
    setFile: (state, action: PayloadAction<ST.FileType>) => {
      const {createdAt, updatedAt, ...rest} = action.payload
      state.file = {...rest, createdAtValue: new Date(createdAt).valueOf(), updatedAtValue: new Date(updatedAt).valueOf()}
    },
    setFileContent: (state, action: PayloadAction<string>) => {
      state.fileContent = action.payload
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    setFileOId: (state, action: PayloadAction<string>) => {
      state.fileOId = action.payload
    },
    setFileUser: (state, action: PayloadAction<ST.UserType>) => {
      const {createdAt, updatedAt, ...rest} = action.payload
      state.fileUser = {...rest, createdAtValue: new Date(createdAt).valueOf(), updatedAtValue: new Date(updatedAt).valueOf()}
    },
    // ::
    unselectFileUser: state => {
      state.isFileUserSelected = false
    }
  }
})
