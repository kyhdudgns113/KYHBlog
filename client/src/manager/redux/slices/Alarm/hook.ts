import {useBlogSelector, useBlogDispatch} from '@redux'
import {alarmSlice} from './slice'

import * as ST from '@shareType'

export const useAlarmStates = () => useBlogSelector(state => state.alarm)

export const useAlarmActions = () => {
  const dispatch = useBlogDispatch()

  return {
    deleteFromAlarmArr: (alarmOId: string) => dispatch(alarmSlice.actions.deleteFromAlarmArr(alarmOId)),
    pushFrontAlarmArr: (alarm: ST.AlarmType) => dispatch(alarmSlice.actions.pushFrontAlarmArr(alarm)),
    resetAlarmArr: () => dispatch(alarmSlice.actions.resetAlarmArr()),
    setAlarmArr: (alarmArr: ST.AlarmType[]) => dispatch(alarmSlice.actions.setAlarmArr(alarmArr)),
    // ::
    closeAlarmObj: () => dispatch(alarmSlice.actions.closeAlarmObj()),
    openAlarmObj: () => dispatch(alarmSlice.actions.openAlarmObj()),
    toggleAlarmObj: () => dispatch(alarmSlice.actions.toggleAlarmObj())
  }
}
