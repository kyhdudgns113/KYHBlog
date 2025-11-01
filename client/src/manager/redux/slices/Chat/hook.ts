import {useBlogSelector, useBlogDispatch} from '@redux'
import {chatSlice} from './slice'

import type * as ST from '@shareType'

export const useChatStates = () => useBlogSelector(state => state.chat)

export const useChatActions = () => {
  const dispatch = useBlogDispatch()

  return {
    pushFrontChatArr: (chatArr: ST.ChatType[]) => dispatch(chatSlice.actions.pushFrontChatArr(chatArr)),
    pushBackChatArr: (chatArr: ST.ChatType[]) => dispatch(chatSlice.actions.pushBackChatArr(chatArr)),

    resetChatArr: () => dispatch(chatSlice.actions.resetChatArr()),
    resetChatRoom: () => dispatch(chatSlice.actions.resetChatRoom()),
    resetChatRoomArr: () => dispatch(chatSlice.actions.resetChatRoomArr()),
    resetChatRoomOId: () => dispatch(chatSlice.actions.resetChatRoomOId()),
    resetGoToBottom: () => dispatch(chatSlice.actions.resetGoToBottom()),
    resetLoadedChatRoomOId: () => dispatch(chatSlice.actions.resetLoadedChatRoomOId()),
    // ::
    selectChatRoom: (chatRoomOId: string) => dispatch(chatSlice.actions.selectChatRoom(chatRoomOId)),
    // ::
    setChatArr: (chatArr: ST.ChatType[]) => dispatch(chatSlice.actions.setChatArr(chatArr)),
    setChatRoom: (chatRoom: ST.ChatRoomType) => dispatch(chatSlice.actions.setChatRoom(chatRoom)),
    setChatRoomArr: (chatRoomArr: ST.ChatRoomType[]) => dispatch(chatSlice.actions.setChatRoomArr(chatRoomArr)),
    setChatRoomOId: (chatRoomOId: string) => dispatch(chatSlice.actions.setChatRoomOId(chatRoomOId)),
    setGoToBottom: (goToBottom: boolean) => dispatch(chatSlice.actions.setGoToBottom(goToBottom)),
    setLoadedChatRoomOId: (loadedChatRoomOId: string) => dispatch(chatSlice.actions.setLoadedChatRoomOId(loadedChatRoomOId))
    // ::
  }
}
