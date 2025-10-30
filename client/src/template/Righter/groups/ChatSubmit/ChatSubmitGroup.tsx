import {useCallback} from 'react'
import {CHAT_MAX_LENGTH} from '@shareValue'
import {useChatCallbacksContext, useSocketStatesContext} from '@context'
import {useChatStates} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter, SocketType} from '@type'

import './ChatSubmitGroup.scss'

type ChatSubmitGroupProps = DivCommonProps & {value: string; setter: Setter<string>}

export const ChatSubmitGroup: FC<ChatSubmitGroupProps> = ({value, setter, className, style, ...props}) => {
  const {socket} = useSocketStatesContext()
  const {chatRoomOId} = useChatStates()
  const {submitChat} = useChatCallbacksContext()

  const onClickSubmit = useCallback(
    (socket: SocketType, chatRoomOId: string, value: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      submitChat(socket, chatRoomOId, value)
      setter('')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`ChatSubmit_Group ${className || ''}`} style={style} {...props}>
      <p className="__length">{`${value.length} / ${CHAT_MAX_LENGTH}`}</p>
      <button className="__submit AppButton_Grey" onClick={onClickSubmit(socket, chatRoomOId, value)}>
        전송
      </button>
    </div>
  )
}
