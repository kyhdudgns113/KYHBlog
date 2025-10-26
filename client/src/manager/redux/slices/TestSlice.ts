import {createSlice} from '@reduxjs/toolkit'
import {useBlogDispatch, useBlogSelector} from '../store'

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

// AREA1: States

export const useTestState = () => useBlogSelector(state => state.test)

// AREA2: Actions

export const useTestActions = () => {
  const dispatch = useBlogDispatch()

  return {
    incCnt: () => dispatch(testSlice.actions.incCnt()),
    decCnt: () => dispatch(testSlice.actions.decCnt()),
    setCnt: (cnt: number) => dispatch(testSlice.actions.setCnt(cnt))
  }
}
