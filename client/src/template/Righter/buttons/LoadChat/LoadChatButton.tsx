import {useCallback} from 'react'
import {useChatCallbacksContext, useChatStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type LoadChatButtonProps = DivCommonProps & {}

export const LoadChatButton: FC<LoadChatButtonProps> = ({className, style, ...props}) => {
  const {chatArr, chatRoomOId} = useChatStatesContext()
  const {loadChatArr} = useChatCallbacksContext()

  const onClickBtn = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()

      if (chatArr.length > 0) {
        loadChatArr(chatRoomOId, chatArr[0].chatIdx)
      }
    },
    [chatArr, chatRoomOId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div
      className={`LoadChat_Button ${className || ''}`}
      onClick={onClickBtn}
      style={style}
      {...props} // ::
    >
      이전 채팅 불러오기
    </div>
  )
}
