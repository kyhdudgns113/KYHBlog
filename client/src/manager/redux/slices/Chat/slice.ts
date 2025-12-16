import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as NV from '@nullValue'
import * as SCK from '@socketType'
import * as ST from '@shareType'

// State 타입 정의
interface ChatState {
  chatArr: LT.ChatTypeLocal[]
  chatQueue: LT.ChatTypeLocal[]
  chatRoom: LT.ChatRoomTypeLocal
  chatRoomArr: LT.ChatRoomTypeLocal[]
  chatRoomOId: string // 현재 선택한 채팅방의 OId
  goToBottom: boolean
  loadedChatRoomOId: string // 채팅목록 불러오기가 완료된 채팅방의 OId
}

// 초기 상태
const initialState: ChatState = {
  chatArr: [],
  chatQueue: [],
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
    clearChatRoomUnreadMsgCnt: (state, action: PayloadAction<string>) => {
      const chatRoomOId = action.payload
      const chatRoom = state.chatRoomArr.find(elem => elem.chatRoomOId === chatRoomOId)
      if (chatRoom) {
        chatRoom.unreadMessageCount = 0
      }
    },

    moveChatQueueToChatArr: state => {
      const insertedChatArr = state.chatQueue.filter(elem => elem.chatRoomOId === state.loadedChatRoomOId)
      state.chatQueue = []
      state.chatArr = [...state.chatArr, ...insertedChatArr]
    },

    pushBackChatQueue: (state, action: PayloadAction<SCK.NewChatType[]>) => {
      const newChatQueue = action.payload.map(elem => {
        const {createdAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf()
        }
      })
      state.chatQueue = [...state.chatQueue, ...newChatQueue]
    },
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
    pushFrontChatRoomArr: (state, action: PayloadAction<SCK.NewChatRoomCreatedType>) => {
      const {lastChatDate, ...rest} = action.payload
      const newChatRoom: LT.ChatRoomTypeLocal = {
        ...rest,
        lastChatDateValue: new Date(lastChatDate).valueOf()
      }
      // 이미 존재하는 채팅방이면 업데이트, 없으면 앞에 추가
      const existingIndex = state.chatRoomArr.findIndex(room => room.chatRoomOId === newChatRoom.chatRoomOId)
      if (existingIndex >= 0) {
        state.chatRoomArr[existingIndex] = newChatRoom
      } // ::
      else {
        state.chatRoomArr = [newChatRoom, ...state.chatRoomArr]
      }
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
      const newChatRoom = state.chatRoomArr.find(elem => elem.chatRoomOId === action.payload)
      if (newChatRoom) {
        state.chatRoom = newChatRoom
      } // ::
      else {
        state.chatRoom = NV.NULL_CHAT_ROOM()
      }
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
    setChatRoomUnreadMsgCnt: (state, action: PayloadAction<SCK.RefreshChatRoomType>) => {
      const {chatRoomOId, unreadMessageCount} = action.payload
      const chatRoom = state.chatRoomArr.find(elem => elem.chatRoomOId === chatRoomOId)
      if (chatRoom) {
        chatRoom.unreadMessageCount = unreadMessageCount
      }
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
    },

    toggleChatRoomOId: (state, action: PayloadAction<string>) => {
      /**
       * 현재 열린 채팅방을 클릭하면 닫게 하려는 용도이다.
       */
      state.chatRoomOId = state.chatRoomOId === action.payload ? '' : action.payload
    }
  }
})
