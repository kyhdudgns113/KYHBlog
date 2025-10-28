import {useBlogSelector, useBlogDispatch} from '@redux'
import {chatSlice} from './slice'

export const useChatStates = () => useBlogSelector(state => state.chat)

export const useChatActions = () => {
  const dispatch = useBlogDispatch()

  return {
    resetChatRoomOId: () => dispatch(chatSlice.actions.resetChatRoomOId()),
    setChatRoomOId: (chatRoomOId: string) => dispatch(chatSlice.actions.setChatRoomOId(chatRoomOId))
  }
}
