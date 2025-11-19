import {useBlogSelector, useBlogDispatch} from '@redux'
import {templateSlice} from './slice'

export const useTemplateStates = () => useBlogSelector(state => state.template)

export const useTemplateActions = () => {
  const dispatch = useBlogDispatch()

  return {
    clickLogInBtn: () => dispatch(templateSlice.actions.clickLogInBtn()),
    clickSignUpBtn: () => dispatch(templateSlice.actions.clickSignUpBtn()),
    resetHeaderBtnClicked: () => dispatch(templateSlice.actions.resetHeaderBtnClicked()),
    toggleLefter: () => dispatch(templateSlice.actions.toggleLefter())
  }
}
