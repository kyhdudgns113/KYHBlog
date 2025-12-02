import {useBlogSelector, useBlogDispatch} from '@redux'

import {lockSlice} from './slice'

export const useLockStates = () => useBlogSelector(state => state.lock)

export const useLockActions = () => {
  const dispatch = useBlogDispatch()

  return {
    lockComment: () => dispatch(lockSlice.actions.lockComment()),
    lockLogIn: () => dispatch(lockSlice.actions.lockLogIn()),
    lockQnaWrite: () => dispatch(lockSlice.actions.lockQnaWrite()),
    lockSignUp: () => dispatch(lockSlice.actions.lockSignUp()),

    unlockComment: () => dispatch(lockSlice.actions.unlockComment()),
    unlockLogIn: () => dispatch(lockSlice.actions.unlockLogIn()),
    unlockQnaWrite: () => dispatch(lockSlice.actions.unlockQnaWrite()),
    unlockSignUp: () => dispatch(lockSlice.actions.unlockSignUp())
  }
}
