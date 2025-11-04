import {useRef, useEffect, useCallback} from 'react'
import {useChatCallbacksContext, useSocketStatesContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, KeyboardEvent, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter, SocketType} from '@type'

import './ChatInputGroup.scss'

type ChatInputGroupProps = DivCommonProps & {value: string; setter: Setter<string>}

export const ChatInputGroup: FC<ChatInputGroupProps> = ({setter, value, className, style, ...props}) => {
  const {socket} = useSocketStatesContext()
  const chatRoomOId = useBlogSelector(state => state.chat.chatRoomOId)
  const {submitChat} = useChatCallbacksContext()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const minHeightPx = 72

  const onClickDiv = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      e.preventDefault()
      e.stopPropagation()
      textareaRef.current.focus()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDownInput = useCallback(
    (socket: SocketType, chatRoomOId: string, value: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        submitChat(socket, chatRoomOId, value)
        setter('')
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeightPx}px`
      textareaRef.current.style.height = `${Math.max(minHeightPx, textareaRef.current.scrollHeight)}px`
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // 상위 컴포넌트 스크롤 방지
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = el.scrollTop === 0
      const isAtBottom = el.scrollTop + el.clientHeight === el.scrollHeight
      const scrollingUp = e.deltaY < 0
      const scrollingDown = e.deltaY > 0

      if ((scrollingUp && isAtTop) || (scrollingDown && isAtBottom)) {
        e.preventDefault()
      }
    }

    el.addEventListener('wheel', handleWheel, {passive: false})
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      className={`ChatInput_Group ${className || ''}`}
      style={style}
      onScroll={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
      {...props} // ::
    >
      <div className="_input_wrapper" onClick={onClickDiv} onScroll={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
        <textarea
          autoFocus
          className="_input_chat"
          onChange={e => setter(e.currentTarget.value)}
          onKeyDown={onKeyDownInput(socket, chatRoomOId, value)}
          ref={textareaRef}
          value={value} // ::
        />
      </div>
    </div>
  )
}
