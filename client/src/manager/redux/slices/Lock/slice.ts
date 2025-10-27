import {createSlice} from '@reduxjs/toolkit'

// State 타입 정의
interface LockState {
  logInLock: boolean
  signUpLock: boolean
}

// 초기 상태
const initialState: LockState = {
  logInLock: false,
  signUpLock: false
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockLogIn: state => {
      state.logInLock = true
    },
    lockSignUp: state => {
      state.signUpLock = true
    },
    unlockLogIn: state => {
      state.logInLock = false
    },
    unlockSignUp: state => {
      state.signUpLock = false
    }
  }
})
