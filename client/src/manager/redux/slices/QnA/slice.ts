import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as NV from '@nullValue'
import * as LT from '@localizeType'
import * as ST from '@shareType'

// State 타입 정의
interface QnAState {
  qnA: LT.QnATypeLocal
  qnARowArr: LT.QnARowTypeLocal[]
}

// 초기 상태
const initialState: QnAState = {
  qnA: NV.NULL_QNA(),
  qnARowArr: []
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    setQnA: (state, action: PayloadAction<ST.QnAType>) => {
      const {createdAt, updatedAt, ...rest} = action.payload
      state.qnA = {...rest, createdAtValue: new Date(createdAt).valueOf(), updatedAtValue: new Date(updatedAt).valueOf()}
    },
    setQnARowArr: (state, action: PayloadAction<ST.QnARowType[]>) => {
      state.qnARowArr = action.payload.map(elem => {
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
