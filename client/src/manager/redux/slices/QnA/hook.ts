import {useBlogSelector, useBlogDispatch} from '@redux'
import {qnaSlice} from './slice'

import * as ST from '@shareType'

export const useQnAStates = () => useBlogSelector(state => state.qna)

export const useQnAActions = () => {
  const dispatch = useBlogDispatch()

  return {
    decQnAPageTenIdx: () => dispatch(qnaSlice.actions.decQnAPageTenIdx()),
    incQnAPageTenIdx: () => dispatch(qnaSlice.actions.incQnAPageTenIdx()),

    resetQnA: () => dispatch(qnaSlice.actions.resetQnA()),
    resetQnARowArr: () => dispatch(qnaSlice.actions.resetQnARowArr()),
    // ::
    setQnA: (qnA: ST.QnAType) => dispatch(qnaSlice.actions.setQnA(qnA)),
    setQnAPageIdx: (qnAPageIdx: number) => dispatch(qnaSlice.actions.setQnAPageIdx(qnAPageIdx)),
    setQnAPageTenIdx: (qnAPageTenIdx: number) => dispatch(qnaSlice.actions.setQnAPageTenIdx(qnAPageTenIdx)),
    setQnARowArr: (qnARowArr: ST.QnARowType[]) => dispatch(qnaSlice.actions.setQnARowArr(qnARowArr))
  }
}
