import {useBlogSelector, useBlogDispatch} from '@redux'
import {testSlice} from './slice'

export const useTestState = () => useBlogSelector(state => state.test)

export const useTestActions = () => {
  const dispatch = useBlogDispatch()

  return {
    incCnt: () => dispatch(testSlice.actions.incCnt()),
    decCnt: () => dispatch(testSlice.actions.decCnt()),
    setCnt: (cnt: number) => dispatch(testSlice.actions.setCnt(cnt))
  }
}
