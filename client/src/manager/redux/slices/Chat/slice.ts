import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface ChatState {
  chatArr: ST.ChatType[]
  chatRoom: ST.ChatRoomType
  chatRoomArr: ST.ChatRoomType[]
  chatRoomOId: string
  goToBottom: boolean
  loadedChatRoomOId: string
}

// 초기 상태
const initialState: ChatState = {
  chatArr: [],
  chatRoom: NV.NULL_CHAT_ROOM(),
  chatRoomArr: [],
  chatRoomOId: '',
  goToBottom: false,
  loadedChatRoomOId: ''
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    pushFrontChatArr: (state, action: PayloadAction<ST.ChatType[]>) => {
      state.chatArr = [...action.payload, ...state.chatArr]
    },
    pushBackChatArr: (state, action: PayloadAction<ST.ChatType[]>) => {
      state.chatArr = [...state.chatArr, ...action.payload]
    },
    resetChatArr: state => {
      state.chatArr = []
    },
    resetChatRoom: state => {
      state.chatRoom = NV.NULL_CHAT_ROOM()
    },
    resetChatRoomArr: state => {
      state.chatRoomArr = []
    },
    resetChatRoomOId: state => {
      state.chatRoomOId = ''
    },
    resetGoToBottom: state => {
      state.goToBottom = false
    },
    resetLoadedChatRoomOId: state => {
      state.loadedChatRoomOId = ''
    },
    // ::
    selectChatRoom: (state, action: PayloadAction<string>) => {
      state.chatRoomOId = state.chatRoomOId === action.payload ? '' : action.payload
    },

    setChatArr: (state, action: PayloadAction<ST.ChatType[]>) => {
      state.chatArr = action.payload.map(elem => {
        elem.createdAt = new Date(elem.createdAt)
        return elem
      })
    },
    setChatRoom: (state, action: PayloadAction<ST.ChatRoomType>) => {
      state.chatRoom = action.payload
    },
    setChatRoomArr: (state, action: PayloadAction<ST.ChatRoomType[]>) => {
      state.chatRoomArr = action.payload
    },
    setChatRoomOId: (state, action: PayloadAction<string>) => {
      state.chatRoomOId = action.payload
    },
    setGoToBottom: (state, action: PayloadAction<boolean>) => {
      state.goToBottom = action.payload
    },
    setLoadedChatRoomOId: (state, action: PayloadAction<string>) => {
      state.loadedChatRoomOId = action.payload
    }
  }
})
