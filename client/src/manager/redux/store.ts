import {useDispatch, useSelector} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'

import * as Slices from './slices'

export const store = configureStore({
  reducer: {
    directory: Slices.directorySlice.reducer,
    lock: Slices.lockSlice.reducer,
    modal: Slices.modalSlice.reducer,
    template: Slices.templateSlice.reducer,
    test: Slices.testSlice.reducer
  }
})

export type BlogState = ReturnType<typeof store.getState>
export type BlogDispatch = typeof store.dispatch

export const useBlogDispatch = useDispatch.withTypes<BlogDispatch>()
export const useBlogSelector = useSelector.withTypes<BlogState>()
