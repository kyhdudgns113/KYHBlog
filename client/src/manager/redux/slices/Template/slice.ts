import {createSlice} from '@reduxjs/toolkit'

// State 타입 정의
interface TemplateState {
  headerBtnClicked: 'logIn' | 'signUp' | null
  isLefterOpen: boolean
}

// 초기 상태
const initialState: TemplateState = {
  headerBtnClicked: null,
  isLefterOpen: true
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    clickLogInBtn: state => {
      if (state.headerBtnClicked === null) {
        state.headerBtnClicked = 'logIn'
      }
    },
    clickSignUpBtn: state => {
      if (state.headerBtnClicked === null) {
        state.headerBtnClicked = 'signUp'
      }
    },
    resetHeaderBtnClicked: state => {
      state.headerBtnClicked = null
    },
    toggleLefter: state => {
      state.isLefterOpen = !state.isLefterOpen
    }
  }
})
