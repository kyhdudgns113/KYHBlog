import {useBlogSelector, useBlogDispatch} from '@redux'
import {qnaSlice} from './slice'

import * as ST from '@shareType'

export const useQnAStates = () => useBlogSelector(state => state.qna)

export const useQnAActions = () => {
  const dispatch = useBlogDispatch()

  return {
    setQnA: (qnA: ST.QnAType) => dispatch(qnaSlice.actions.setQnA(qnA)),
    setQnAArr: (qnAArr: ST.QnAType[]) => dispatch(qnaSlice.actions.setQnAArr(qnAArr))
  }
}
