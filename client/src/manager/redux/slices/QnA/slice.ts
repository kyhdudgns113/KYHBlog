import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as NV from '@nullValue'
import * as LT from '@localizeType'
import * as ST from '@shareType'
import * as V from '@value'

// State 타입 정의
interface QnAState {
  qnA: LT.QnATypeLocal
  qnACommentArr: LT.QnACommentTypeLocal[]
  qnAPageIdx: number
  qnAPageTenIdx: number
  qnARowArr: LT.QnARowTypeLocal[]
}

// 초기 상태
const initialState: QnAState = {
  qnA: NV.NULL_QNA(),
  qnACommentArr: [],
  qnAPageIdx: 0,
  qnAPageTenIdx: 0,
  qnARowArr: []
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    decQnAPageTenIdx: state => {
      state.qnAPageTenIdx = Math.max(0, state.qnAPageTenIdx - 1)
    },
    incQnAPageTenIdx: state => {
      state.qnAPageTenIdx = Math.min(Math.floor(state.qnARowArr.length / V.QNA_PER_PAGE) - 1, state.qnAPageTenIdx + 1)
    },

    resetQnA: state => {
      state.qnA = NV.NULL_QNA()
    },
    resetQnACommentArr: state => {
      state.qnACommentArr = []
    },
    resetQnARowArr: state => {
      state.qnARowArr = []
    },
    // ::
    setQnA: (state, action: PayloadAction<ST.QnAType>) => {
      const {createdAt, updatedAt, ...rest} = action.payload
      state.qnA = {...rest, createdAtValue: new Date(createdAt).valueOf(), updatedAtValue: new Date(updatedAt).valueOf()}
    },
    setQnACommentArr: (state, action: PayloadAction<ST.QnACommentType[]>) => {
      state.qnACommentArr = action.payload.map(elem => {
        const {createdAt, updatedAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf(),
          updatedAtValue: new Date(updatedAt).valueOf()
        }
      })
    },
    setQnAPageIdx: (state, action: PayloadAction<number>) => {
      state.qnAPageIdx = action.payload
    },
    setQnAPageTenIdx: (state, action: PayloadAction<number>) => {
      state.qnAPageTenIdx = action.payload
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
