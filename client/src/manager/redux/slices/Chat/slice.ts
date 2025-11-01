import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as NV from '@nullValue'
import * as ST from '@shareType'

// State 타입 정의
interface ChatState {
  chatArr: LT.ChatTypeLocal[]
  chatRoom: LT.ChatRoomTypeLocal
  chatRoomArr: LT.ChatRoomTypeLocal[]
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
      const newChatArr = action.payload.map(elem => {
        const {createdAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf()
        }
      })

      state.chatArr = [...newChatArr, ...state.chatArr]
    },
    pushBackChatArr: (state, action: PayloadAction<ST.ChatType[]>) => {
      const newChatArr = action.payload.map(elem => {
        const {createdAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf()
        }
      })
      state.chatArr = [...state.chatArr, ...newChatArr]
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
      const newChatArr = action.payload.map(elem => {
        const {createdAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf()
        }
      })
      state.chatArr = newChatArr
    },
    setChatRoom: (state, action: PayloadAction<ST.ChatRoomType>) => {
      const {lastChatDate, ...rest} = action.payload
      state.chatRoom = {...rest, lastChatDateValue: new Date(lastChatDate).valueOf()}
    },
    setChatRoomArr: (state, action: PayloadAction<ST.ChatRoomType[]>) => {
      const newChatRoomArr = action.payload.map(elem => {
        const {lastChatDate, ...rest} = elem
        return {
          ...rest,
          lastChatDateValue: new Date(lastChatDate).valueOf()
        }
      })
      state.chatRoomArr = newChatRoomArr
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
