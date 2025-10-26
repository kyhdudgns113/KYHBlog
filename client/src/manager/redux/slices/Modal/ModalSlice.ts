import {createSlice} from '@reduxjs/toolkit'

import * as V from '@value'

// State 타입 정의
interface ModalState {
  modalName: string
}

// 초기 상태
const initialState: ModalState = {
  modalName: ''
}

// Slice 생성 (액션 + 리듀서를 한번에)
export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    closeModal: state => {
      state.modalName = ''
    },
    openLogInModal: state => {
      state.modalName = V.MODAL_LOG_IN
    },
    openSignUpModal: state => {
      state.modalName = V.MODAL_SIGN_UP
    }
  }
})
