import {createSlice} from '@reduxjs/toolkit'
import {useBlogDispatch, useBlogSelector} from '../store'

import type {PayloadAction} from '@reduxjs/toolkit' // eslint-disable-line

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

// AREA1: States

export const useModalState = () => useBlogSelector(state => state.modal)

// AREA2: Actions

export const useModalActions = () => {
  const dispatch = useBlogDispatch()

  return {
    closeModal: () => dispatch(modalSlice.actions.closeModal()),
    openLogInModal: () => dispatch(modalSlice.actions.openLogInModal()),
    openSignUpModal: () => dispatch(modalSlice.actions.openSignUpModal())
  }
}
