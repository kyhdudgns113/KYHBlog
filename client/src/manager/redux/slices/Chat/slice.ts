import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

// State 타입 정의
interface ChatState {
  chatRoomOId: string
}

// 초기 상태
const initialState: ChatState = {
  chatRoomOId: ''
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatRoomOId: state => {
      state.chatRoomOId = ''
    },
    // ::
    setChatRoomOId: (state, action: PayloadAction<string>) => {
      state.chatRoomOId = action.payload
    }
  }
})
