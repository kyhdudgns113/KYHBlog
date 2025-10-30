import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as ST from '@shareType'

// State 타입 정의
interface CommentState {
  commentContent: string // 현재 열려있는 파일의 댓글 내용
  commentOId_delete: string // 삭제할 댓글의 OId
  commentOId_edit: string // 수정할 댓글의 OId
  commentOId_reply: string // 대댓글을 작성할 댓글의 OId
  commentOId_user: string // 작성된 유저가 선택된 댓글의 OId
  commentReplyArr: (ST.CommentType | ST.ReplyType)[] // 현재 열려있는 파일의 댓글 및 대댓글 배열
  pageIdx: number // 현재 댓글 페이지 인덱스스
  pageTenIdx: number // 현재 10개 페이지 인덱스
  replyContent: string // 현재 열려있는 파일의 대댓글 내용
  replyOId_delete: string // 삭제할 대댓글의 OId
  replyOId_edit: string // 수정할 대댓글의 OId
  replyOId_reply: string // 대댓글을 작성할 대댓글의 OId
  replyOId_user: string // 작성된 유저가 선택된 대댓글의 OId
}

// 초기 상태
const initialState: CommentState = {
  commentContent: '',
  commentOId_delete: '',
  commentOId_edit: '',
  commentOId_reply: '',
  commentOId_user: '',
  commentReplyArr: [],
  pageIdx: 0,
  pageTenIdx: 0,
  replyContent: '',
  replyOId_delete: '',
  replyOId_edit: '',
  replyOId_reply: '',
  replyOId_user: ''
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    decPageTenIdx: state => {
      state.pageTenIdx = Math.max(0, state.pageTenIdx - 1)
    },
    incPageTenIdx: state => {
      state.pageTenIdx = Math.min(Math.floor(state.commentReplyArr.length / (10 * 10)) - 1, state.pageTenIdx + 1)
    },
    // ::
    resetCommentContent: state => {
      state.commentContent = ''
    },
    resetCommentOId_delete: state => {
      state.commentOId_delete = ''
    },
    resetCommentOId_edit: state => {
      state.commentOId_edit = ''
    },
    resetCommentOId_reply: state => {
      state.commentOId_reply = ''
    },
    resetCommentOId_user: state => {
      state.commentOId_user = ''
    },
    resetCommentReplyArr: state => {
      state.commentReplyArr = []
    },
    resetPageIdx: state => {
      state.pageIdx = 0
    },
    resetPageTenIdx: state => {
      state.pageTenIdx = 0
    },
    resetReplyContent: state => {
      state.replyContent = ''
    },
    resetReplyOId_delete: state => {
      state.replyOId_delete = ''
    },
    resetReplyOId_edit: state => {
      state.replyOId_edit = ''
    },
    resetReplyOId_reply: state => {
      state.replyOId_reply = ''
    },
    resetReplyOId_user: state => {
      state.replyOId_user = ''
    },
    // ::
    setCommentContent: (state, action: PayloadAction<string>) => {
      state.commentContent = action.payload
    },
    setCommentOId_delete: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = action.payload
      state.commentOId_edit = ''
      state.commentOId_reply = ''
      state.replyOId_delete = ''
      state.replyOId_edit = ''
      state.replyOId_reply = ''
    },
    setCommentOId_edit: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = ''
      state.commentOId_edit = action.payload
      state.commentOId_reply = ''
      state.replyOId_delete = ''
      state.replyOId_edit = ''
      state.replyOId_reply = ''
    },
    setCommentOId_reply: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = ''
      state.commentOId_edit = ''
      state.commentOId_reply = action.payload
      state.replyOId_delete = ''
      state.replyOId_edit = ''
      state.replyOId_reply = ''
    },
    setCommentOId_user: (state, action: PayloadAction<string>) => {
      state.commentOId_user = action.payload
      state.replyOId_user = ''
    },
    setCommentReplyArr: (state, action: PayloadAction<(ST.CommentType | ST.ReplyType)[]>) => {
      state.commentReplyArr = action.payload.map(elem => {
        elem.createdAt = new Date(elem.createdAt)
        return elem
      })
    },
    setPageIdx: (state, action: PayloadAction<number>) => {
      state.pageIdx = action.payload
    },
    setPageTenIdx: (state, action: PayloadAction<number>) => {
      state.pageTenIdx = action.payload
    },
    // ::
    setReplyContent: (state, action: PayloadAction<string>) => {
      state.replyContent = action.payload
    },
    setReplyOId_delete: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = ''
      state.commentOId_edit = ''
      state.commentOId_reply = ''
      state.replyOId_delete = action.payload
      state.replyOId_edit = ''
      state.replyOId_reply = ''
    },
    setReplyOId_edit: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = ''
      state.commentOId_edit = ''
      state.commentOId_reply = ''
      state.replyOId_delete = ''
      state.replyOId_edit = action.payload
      state.replyOId_reply = ''
    },
    setReplyOId_reply: (state, action: PayloadAction<string>) => {
      state.commentOId_delete = ''
      state.commentOId_edit = ''
      state.commentOId_reply = ''
      state.replyOId_delete = ''
      state.replyOId_edit = ''
      state.replyOId_reply = action.payload
    },
    setReplyOId_user: (state, action: PayloadAction<string>) => {
      state.commentOId_user = ''
      state.replyOId_user = action.payload
    }
  }
})
