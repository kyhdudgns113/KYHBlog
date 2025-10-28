import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface FileState {
  commentReplyArr: (ST.CommentType | ST.ReplyType)[] // 현재 열려있는 파일의 댓글 및 대댓글 배열
  file: ST.FileType // 현재 열려있는 파일
  fileContent: string // 수정중인 파일의 내용
  fileName: string // 수정중인 파일의 이름
  fileOId: string // 현재 열려있는 파일의 OId
  fileUser: ST.UserType // 현재 열려있는 파일의 작성자
}

// 초기 상태
const initialState: FileState = {
  commentReplyArr: [],
  file: NV.NULL_FILE(),
  fileContent: '',
  fileName: '',
  fileOId: '',
  fileUser: NV.NULL_USER()
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    resetCommentReplyArr: state => {
      state.commentReplyArr = []
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
    setCommentReplyArr: (state, action: PayloadAction<(ST.CommentType | ST.ReplyType)[]>) => {
      state.commentReplyArr = action.payload
    },
    setFile: (state, action: PayloadAction<ST.FileType>) => {
      state.file = action.payload
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
      state.fileUser = action.payload
    }
  }
})
