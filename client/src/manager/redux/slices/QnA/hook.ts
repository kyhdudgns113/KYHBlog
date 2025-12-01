import {useBlogSelector, useBlogDispatch} from '@redux'
import {qnaSlice} from './slice'

import * as ST from '@shareType'

export const useQnaStates = () => useBlogSelector(state => state.qna)

export const useQnaActions = () => {
  const dispatch = useBlogDispatch()

  return {
    setQnaArr: (qnaArr: ST.QnAType[]) => dispatch(qnaSlice.actions.setQnaArr(qnaArr))
  }
}
