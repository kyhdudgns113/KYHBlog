import {useBlogSelector, useBlogDispatch} from '@redux'
import {chatSlice} from './slice'

import type * as SCK from '@socketType'
import type * as ST from '@shareType'

export const useChatStates = () => useBlogSelector(state => state.chat)

export const useChatActions = () => {
  const dispatch = useBlogDispatch()

  return {
    moveChatQueueToChatArr: () => dispatch(chatSlice.actions.moveChatQueueToChatArr()),

    pushBackChatQueue: (chatQueue: SCK.NewChatType[]) => dispatch(chatSlice.actions.pushBackChatQueue(chatQueue)),
    pushFrontChatArr: (chatArr: ST.ChatType[]) => dispatch(chatSlice.actions.pushFrontChatArr(chatArr)),
    pushFrontChatRoomArr: (chatRoom: SCK.NewChatRoomCreatedType) => dispatch(chatSlice.actions.pushFrontChatRoomArr(chatRoom)),

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
    setLoadedChatRoomOId: (loadedChatRoomOId: string) => dispatch(chatSlice.actions.setLoadedChatRoomOId(loadedChatRoomOId)),
    // ::
    toggleChatRoomOId: (chatRoomOId: string) => dispatch(chatSlice.actions.toggleChatRoomOId(chatRoomOId))
  }
}
