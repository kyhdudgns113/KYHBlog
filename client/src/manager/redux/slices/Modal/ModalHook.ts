import {useBlogSelector, useBlogDispatch} from '@redux'
import {modalSlice} from './ModalSlice'

export const useModalStates = () => useBlogSelector(state => state.modal)

export const useModalActions = () => {
  const dispatch = useBlogDispatch()

  return {
    closeModal: () => dispatch(modalSlice.actions.closeModal()),
    openEditDirModal: () => dispatch(modalSlice.actions.openEditDirModal()),
    openEditFileModal: () => dispatch(modalSlice.actions.openEditFileModal()),
    openLogInModal: () => dispatch(modalSlice.actions.openLogInModal()),
    openSignUpModal: () => dispatch(modalSlice.actions.openSignUpModal())
  }
}
