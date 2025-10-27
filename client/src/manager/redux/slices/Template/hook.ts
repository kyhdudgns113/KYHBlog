import {useBlogSelector, useBlogDispatch} from '@redux'
import {templateSlice} from './slice'

export const useTemplateStates = () => useBlogSelector(state => state.template)

export const useTemplateActions = () => {
  const dispatch = useBlogDispatch()

  return {
    toggleLefter: () => dispatch(templateSlice.actions.toggleLefter()),
    toggleRighter: () => dispatch(templateSlice.actions.toggleRighter())
  }
}
