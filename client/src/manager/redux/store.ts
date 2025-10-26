import {useDispatch, useSelector} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'

import * as Slices from './slices'

const store = configureStore({
  reducer: {
    test: Slices.testSlice.reducer
  }
})

export type BlogState = ReturnType<typeof store.getState>
export type BlogDispatch = typeof store.dispatch

export const useBlogDispatch = useDispatch.withTypes<BlogDispatch>()
export const useBlogSelector = useSelector.withTypes<BlogState>()
