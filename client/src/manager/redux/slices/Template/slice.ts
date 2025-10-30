import {createSlice} from '@reduxjs/toolkit'

// State 타입 정의
interface TemplateState {
  isLefterOpen: boolean
  isRighterOpen: boolean
}

// 초기 상태
const initialState: TemplateState = {
  isLefterOpen: true,
  isRighterOpen: true
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    toggleLefter: state => {
      state.isLefterOpen = !state.isLefterOpen
    },
    toggleRighter: state => {
      state.isRighterOpen = !state.isRighterOpen
    }
  }
})
