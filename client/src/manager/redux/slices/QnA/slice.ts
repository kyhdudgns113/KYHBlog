import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as ST from '@shareType'

// State 타입 정의
interface QnAState {
  qnaArr: LT.QnATypeLocal[]
}

// 초기 상태
const initialState: QnAState = {
  qnaArr: []
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    setQnaArr: (state, action: PayloadAction<ST.QnAType[]>) => {
      state.qnaArr = action.payload.map(elem => {
        const {createdAt, updatedAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf(),
          updatedAtValue: new Date(updatedAt).valueOf()
        }
      })
    }
  }
})
