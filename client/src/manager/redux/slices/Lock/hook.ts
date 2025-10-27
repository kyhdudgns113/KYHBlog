import {useBlogSelector, useBlogDispatch} from '@redux'

import {lockSlice} from './slice'

export const useLockStates = () => useBlogSelector(state => state.lock)

export const useLockActions = () => {
  const dispatch = useBlogDispatch()

  return {
    lockLogIn: () => dispatch(lockSlice.actions.lockLogIn()),
    lockSignUp: () => dispatch(lockSlice.actions.lockSignUp()),
    unlockLogIn: () => dispatch(lockSlice.actions.unlockLogIn()),
    unlockSignUp: () => dispatch(lockSlice.actions.unlockSignUp())
  }
}
