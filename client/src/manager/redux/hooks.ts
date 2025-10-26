import {useDispatch, useSelector} from 'react-redux'
import {modalSlice} from './slices/ModalSlice'
import {testSlice} from './slices/TestSlice'
import {useBlogDispatch, useBlogSelector} from './store'

// Modal Hooks
export const useModalState = () => useBlogSelector(state => state.modal)

export const useModalActions = () => {
  const dispatch = useBlogDispatch()

  return {
    closeModal: () => dispatch(modalSlice.actions.closeModal()),
    openLogInModal: () => dispatch(modalSlice.actions.openLogInModal()),
    openSignUpModal: () => dispatch(modalSlice.actions.openSignUpModal())
  }
}

// Test Hooks
export const useTestState = () => useBlogSelector(state => state.test)

export const useTestActions = () => {
  const dispatch = useBlogDispatch()

  return {
    incCnt: () => dispatch(testSlice.actions.incCnt()),
    decCnt: () => dispatch(testSlice.actions.decCnt()),
    setCnt: (cnt: number) => dispatch(testSlice.actions.setCnt(cnt))
  }
}
