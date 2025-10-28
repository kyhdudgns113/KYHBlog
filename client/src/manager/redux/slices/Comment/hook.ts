import {useBlogSelector, useBlogDispatch} from '@redux'
import {commentSlice} from './slice'

import * as ST from '@shareType'

export const useCommentStates = () => useBlogSelector(state => state.comment)

export const useCommentActions = () => {
  const dispatch = useBlogDispatch()

  return {
    decPageTenIdx: () => dispatch(commentSlice.actions.decPageTenIdx()),
    incPageTenIdx: () => dispatch(commentSlice.actions.incPageTenIdx()),
    // ::
    resetCommentContent: () => dispatch(commentSlice.actions.resetCommentContent()),
    resetCommentOId_delete: () => dispatch(commentSlice.actions.resetCommentOId_delete()),
    resetCommentOId_edit: () => dispatch(commentSlice.actions.resetCommentOId_edit()),
    resetCommentOId_reply: () => dispatch(commentSlice.actions.resetCommentOId_reply()),
    resetCommentOId_user: () => dispatch(commentSlice.actions.resetCommentOId_user()),
    resetCommentReplyArr: () => dispatch(commentSlice.actions.resetCommentReplyArr()),
    resetPageIdx: () => dispatch(commentSlice.actions.resetPageIdx()),
    resetPageTenIdx: () => dispatch(commentSlice.actions.resetPageTenIdx()),
    resetReplyContent: () => dispatch(commentSlice.actions.resetReplyContent()),
    resetReplyOId_delete: () => dispatch(commentSlice.actions.resetReplyOId_delete()),
    resetReplyOId_edit: () => dispatch(commentSlice.actions.resetReplyOId_edit()),
    resetReplyOId_reply: () => dispatch(commentSlice.actions.resetReplyOId_reply()),
    resetReplyOId_user: () => dispatch(commentSlice.actions.resetReplyOId_user()),
    // ::
    setCommentContent: (commentContent: string) => dispatch(commentSlice.actions.setCommentContent(commentContent)),
    setCommentOId_delete: (commentOId_delete: string) => dispatch(commentSlice.actions.setCommentOId_delete(commentOId_delete)),
    setCommentOId_edit: (commentOId_edit: string) => dispatch(commentSlice.actions.setCommentOId_edit(commentOId_edit)),
    setCommentOId_reply: (commentOId_reply: string) => dispatch(commentSlice.actions.setCommentOId_reply(commentOId_reply)),
    setCommentOId_user: (commentOId_user: string) => dispatch(commentSlice.actions.setCommentOId_user(commentOId_user)),
    setCommentReplyArr: (commentReplyArr: (ST.CommentType | ST.ReplyType)[]) => dispatch(commentSlice.actions.setCommentReplyArr(commentReplyArr)),
    setPageIdx: (pageIdx: number) => dispatch(commentSlice.actions.setPageIdx(pageIdx)),
    setPageTenIdx: (pageTenIdx: number) => dispatch(commentSlice.actions.setPageTenIdx(pageTenIdx)),
    setReplyContent: (replyContent: string) => dispatch(commentSlice.actions.setReplyContent(replyContent)),
    setReplyOId_delete: (replyOId_delete: string) => dispatch(commentSlice.actions.setReplyOId_delete(replyOId_delete)),
    setReplyOId_edit: (replyOId_edit: string) => dispatch(commentSlice.actions.setReplyOId_edit(replyOId_edit)),
    setReplyOId_reply: (replyOId_reply: string) => dispatch(commentSlice.actions.setReplyOId_reply(replyOId_reply)),
    setReplyOId_user: (replyOId_user: string) => dispatch(commentSlice.actions.setReplyOId_user(replyOId_user))
  }
}
