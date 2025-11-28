import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as LT from '@localizeType'
import * as ST from '@shareType'

// State 타입 정의
interface AlarmState {
  alarmArr: LT.AlarmTypeLocal[]
  isAlarmObjOpen: boolean
}

// 초기 상태
const initialState: AlarmState = {
  alarmArr: [],
  isAlarmObjOpen: false
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    pushFrontAlarmArr: (state, action: PayloadAction<ST.AlarmType>) => {
      const {createdAt, ...rest} = action.payload
      const newElem: LT.AlarmTypeLocal = {
        ...rest,
        createdAtValue: new Date(createdAt).valueOf()
      }
      state.alarmArr = [newElem, ...state.alarmArr]
    },
    resetAlarmArr: state => {
      state.alarmArr = []
    },
    setAlarmArr: (state, action: PayloadAction<ST.AlarmType[]>) => {
      state.alarmArr = action.payload.map(elem => {
        const {createdAt, ...rest} = elem
        return {
          ...rest,
          createdAtValue: new Date(createdAt).valueOf()
        }
      })
    },
    // ::
    closeAlarmObj: state => {
      state.isAlarmObjOpen = false
    },
    openAlarmObj: state => {
      state.isAlarmObjOpen = true
    },
    toggleAlarmObj: state => {
      state.isAlarmObjOpen = !state.isAlarmObjOpen
    }
  }
})
