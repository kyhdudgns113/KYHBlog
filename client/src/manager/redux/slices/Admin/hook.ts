import {useBlogSelector, useBlogDispatch} from '@redux'
import {adminSlice} from './slice'

import * as ST from '@shareType'

export const useAdminStates = () => useBlogSelector(state => state.admin)

export const useAdminActions = () => {
  const dispatch = useBlogDispatch()

  return {
    resetIsLoadingLogArr: () => dispatch(adminSlice.actions.resetIsLoadingLogArr()),
    resetIsLoadingUserArr: () => dispatch(adminSlice.actions.resetIsLoadingUserArr()),
    resetLogArr: () => dispatch(adminSlice.actions.resetLogArr()),
    resetLogOId_showError: () => dispatch(adminSlice.actions.resetLogOId_showError()),
    resetLogOId_showStatus: () => dispatch(adminSlice.actions.resetLogOId_showStatus()),
    resetUserArr: () => dispatch(adminSlice.actions.resetUserArr()),
    resetUserArrFiltered: () => dispatch(adminSlice.actions.resetUserArrFiltered()),
    // ::
    setIsLoadingLogArr: (isLoadingLogArr: boolean | null) => dispatch(adminSlice.actions.setIsLoadingLogArr(isLoadingLogArr)),
    setIsLoadingUserArr: (isLoadingUserArr: boolean | null) => dispatch(adminSlice.actions.setIsLoadingUserArr(isLoadingUserArr)),
    setLogArr: (logArr: ST.LogType[]) => dispatch(adminSlice.actions.setLogArr(logArr)),
    setLogOId_showError: (logOId_showError: string) => dispatch(adminSlice.actions.setLogOId_showError(logOId_showError)),
    setLogOId_showStatus: (logOId_showStatus: string) => dispatch(adminSlice.actions.setLogOId_showStatus(logOId_showStatus)),
    setUserArr: (userArr: ST.UserType[]) => dispatch(adminSlice.actions.setUserArr(userArr)),
    setUserArrFiltered: (userArrFiltered: ST.UserType[]) => dispatch(adminSlice.actions.setUserArrFiltered(userArrFiltered)),

    sortUserArrFiltered: (oldSortType: string, sortType: string) => dispatch(adminSlice.actions.sortUserArrFiltered({oldSortType, sortType}))
  }
}
