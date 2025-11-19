import {useBlogSelector, useBlogDispatch} from '@redux'
import {templateSlice} from './slice'

export const useTemplateStates = () => useBlogSelector(state => state.template)

export const useTemplateActions = () => {
  const dispatch = useBlogDispatch()

  return {
    // AREA1: headerBtnClicked
    clickLogInBtn: () => dispatch(templateSlice.actions.clickLogInBtn()),
    clickSignUpBtn: () => dispatch(templateSlice.actions.clickSignUpBtn()),
    resetHeaderBtnClicked: () => dispatch(templateSlice.actions.resetHeaderBtnClicked()),

    // AREA2: isLefterOpen
    toggleLefter: () => dispatch(templateSlice.actions.toggleLefter()),

    // AREA3: nowTab
    resetNowTab: () => dispatch(templateSlice.actions.resetNowTab()),
    setNowTab: (tab: 'home' | 'blog' | 'qna' | 'contact') => dispatch(templateSlice.actions.setNowTab(tab))
  }
}
