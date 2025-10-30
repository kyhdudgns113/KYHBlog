import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

// State 타입 정의
interface TestState {
  cnt: number
}

// 초기 상태
const initialState: TestState = {
  cnt: 0
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    // 1씩 증가
    incCnt: state => {
      state.cnt += 1
    },
    // 1씩 감소
    decCnt: state => {
      state.cnt -= 1
    },
    // 특정 값만큼 증가
    setCnt: (state, action: PayloadAction<number>) => {
      state.cnt = action.payload
    }
  }
})
