import {useDispatch, useSelector} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'

import * as Slices from './slices'

export const store = configureStore({
  reducer: {
    admin: Slices.adminSlice.reducer,
    alarm: Slices.alarmSlice.reducer,
    chat: Slices.chatSlice.reducer,
    comment: Slices.commentSlice.reducer,
    directory: Slices.directorySlice.reducer,
    file: Slices.fileSlice.reducer,
    lock: Slices.lockSlice.reducer,
    modal: Slices.modalSlice.reducer,
    template: Slices.templateSlice.reducer,
    test: Slices.testSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['file/setFile', 'comment/setCommentReplyArr'],
        ignoredPaths: ['file', 'comment']
      }
    })
})

export type BlogState = ReturnType<typeof store.getState>
export type BlogDispatch = typeof store.dispatch

export const useBlogDispatch = useDispatch.withTypes<BlogDispatch>()
export const useBlogSelector = useSelector.withTypes<BlogState>()
