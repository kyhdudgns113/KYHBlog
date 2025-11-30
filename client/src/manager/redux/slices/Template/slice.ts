import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit'

import * as T from '@type'

// State 타입 정의
interface TemplateState {
  headerBtnClicked: T.HeaderBtnClickedType
  isLefterOpen: boolean
  nowTab: T.NowTabType
}

// 초기 상태
const initialState: TemplateState = {
  headerBtnClicked: null,
  isLefterOpen: true,
  nowTab: null
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // AREA1: headerBtnClicked
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
    // AREA2: isLefterOpen
    toggleLefter: state => {
      state.isLefterOpen = !state.isLefterOpen
    },
    // AREA3: nowTab
    resetNowTab: state => {
      state.nowTab = null
    },
    setNowTab: (state, action: PayloadAction<T.NowTabType>) => {
      state.nowTab = action.payload
    }
  }
})
