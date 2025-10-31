import {createSlice} from '@reduxjs/toolkit'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

import * as ST from '@shareType'

// State 타입 정의
interface AdminState {
  isLoadingLogArr: boolean | null
  logArr: ST.LogType[]
  logOId_showError: string
  logOId_showStatus: string
  isLoadingUserArr: boolean | null
  userArr: ST.UserType[]
  userArrFiltered: ST.UserType[]
  userArrSortType: string
}

// 초기 상태
const initialState: AdminState = {
  isLoadingLogArr: true,
  logArr: [],
  logOId_showError: '',
  logOId_showStatus: '',
  isLoadingUserArr: true,
  userArr: [],
  userArrFiltered: [],
  userArrSortType: 'userId'
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetIsLoadingLogArr: state => {
      state.isLoadingLogArr = null
    },
    resetIsLoadingUserArr: state => {
      state.isLoadingUserArr = null
    },
    resetLogArr: state => {
      state.logArr = []
    },
    resetLogOId_showError: state => {
      state.logOId_showError = ''
    },
    resetLogOId_showStatus: state => {
      state.logOId_showStatus = ''
    },
    resetUserArr: state => {
      state.userArr = []
    },
    resetUserArrFiltered: state => {
      state.userArrFiltered = []
    },
    // ::
    setIsLoadingLogArr: (state, action: PayloadAction<boolean | null>) => {
      state.isLoadingLogArr = action.payload
    },
    setIsLoadingUserArr: (state, action: PayloadAction<boolean | null>) => {
      state.isLoadingUserArr = action.payload
    },
    setLogArr: (state, action: PayloadAction<ST.LogType[]>) => {
      state.logArr = action.payload
    },
    setLogOId_showError: (state, action: PayloadAction<string>) => {
      state.logOId_showError = action.payload
    },
    setLogOId_showStatus: (state, action: PayloadAction<string>) => {
      state.logOId_showStatus = action.payload
    },
    setUserArr: (state, action: PayloadAction<ST.UserType[]>) => {
      state.userArr = action.payload
    },
    setUserArrFiltered: (state, action: PayloadAction<ST.UserType[]>) => {
      state.userArrFiltered = action.payload
    },
    // ::
    sortUserArrFiltered: (state, action: PayloadAction<{oldSortType: string; sortType: string}>) => {
      const {oldSortType, sortType} = action.payload

      const preOldSortType = oldSortType.split('_')[0]
      const postOldSortType = oldSortType.split('_')[1]

      if (preOldSortType === sortType) {
        state.userArrFiltered = state.userArrFiltered.sort((a, b) => {
          if (preOldSortType === 'userId') {
            return postOldSortType === 'ASC' ? b.userId.localeCompare(a.userId) : a.userId.localeCompare(b.userId)
          } // ::
          else if (preOldSortType === 'userName') {
            return postOldSortType === 'ASC' ? b.userName.localeCompare(a.userName) : a.userName.localeCompare(b.userName)
          } // ::
          else if (preOldSortType === 'userMail') {
            return postOldSortType === 'ASC' ? b.userMail.localeCompare(a.userMail) : a.userMail.localeCompare(b.userMail)
          } // ::
          else if (preOldSortType === 'createdAt') {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return postOldSortType === 'ASC' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
          } // ::
          else {
            return 0
          }
        })
        state.userArrSortType = `${sortType}_${postOldSortType === 'ASC' ? 'DESC' : 'ASC'}`
      } // ::
      else {
        state.userArrFiltered = state.userArrFiltered.sort((a, b) => {
          if (sortType === 'userId') {
            return a.userId.localeCompare(b.userId)
          } // ::
          else if (sortType === 'userName') {
            return a.userName.localeCompare(b.userName)
          } // ::
          else if (sortType === 'userMail') {
            return a.userMail.localeCompare(b.userMail)
          } // ::
          else if (sortType === 'createdAt') {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return dateA.getTime() - dateB.getTime()
          } // ::
          else {
            return 0
          }
        })
        state.userArrSortType = `${sortType}_ASC`
      }
    }
  }
})
