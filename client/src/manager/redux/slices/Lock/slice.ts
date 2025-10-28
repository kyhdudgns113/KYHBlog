import {createSlice} from '@reduxjs/toolkit'

// State 타입 정의
interface LockState {
  commentLock: boolean
  logInLock: boolean
  signUpLock: boolean
}

// 초기 상태
const initialState: LockState = {
  commentLock: false,
  logInLock: false,
  signUpLock: false
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockComment: state => {
      state.commentLock = true
    },
    lockLogIn: state => {
      state.logInLock = true
    },
    lockSignUp: state => {
      state.signUpLock = true
    },
    unlockComment: state => {
      state.commentLock = false
    },
    unlockLogIn: state => {
      state.logInLock = false
    },
    unlockSignUp: state => {
      state.signUpLock = false
    }
  }
})
