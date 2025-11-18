import {useEffect, useState} from 'react'

import {useAuthStatesContext, useChatStatesContext} from '@context'
import {useBlogSelector} from '@redux'

import {LoadChatButton} from '../../buttons'
import {ChatBlockMyGroup, ChatBlockOtherGroup} from '../../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as LT from '@localizeType'

import './ChatListObject.scss'

type ChatListObjectProps = DivCommonProps & {}

export const ChatListObject: FC<ChatListObjectProps> = ({className, style, ...props}) => {
  const chatArr = useBlogSelector(state => state.chat.chatArr)

  const {userOId} = useAuthStatesContext()
  const {chatAreaRef} = useChatStatesContext()

  const [showLoadBtn, setShowLoadBtn] = useState<boolean>(false)

  let lastUserOId = ''
  let lastDateValue = new Date(0).valueOf()
  let lastMinute = 0

  // 초기화: 이전 채팅 불러오는 버튼 표시상태
  useEffect(() => {
    if (chatArr.length > 0 && chatArr[0].chatIdx > 0) {
      setShowLoadBtn(true)
    } // ::
    else {
      setShowLoadBtn(false)
    }
  }, [chatArr])

  // 상위 컴포넌트 스크롤 안되게 하기
  useEffect(() => {
    const el = chatAreaRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = el.scrollTop === 0
      const isAtBottom = el.scrollTop + el.clientHeight === el.scrollHeight
      const scrollingUp = e.deltaY < 0
      const scrollingDown = e.deltaY > 0

      if ((scrollingUp && isAtTop) || (scrollingDown && isAtBottom)) {
        e.preventDefault() // 이제 진짜로 body 스크롤 안 됨
      }
    }

    el.addEventListener('wheel', handleWheel, {passive: false})
    return () => el.removeEventListener('wheel', handleWheel)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ChatList_Object ${className || ''}`} ref={chatAreaRef} style={style} {...props}>
      {showLoadBtn && <LoadChatButton />}

      {chatArr.map((chat, idx) => {
        const chatDate = new Date(chat.createdAtValue)

        const isSameUserWithLast = chat.userOId === lastUserOId
        const isSameMinute = chatDate.getMinutes() === lastMinute
        const isSimilarTime = chatDate.valueOf() - lastDateValue < 1000 * 60 * 3

        const isSameArea = isSameUserWithLast && isSameMinute && isSimilarTime

        lastUserOId = chat.userOId
        lastDateValue = chatDate.valueOf()
        lastMinute = chatDate.getMinutes()

        if (chat.userOId === userOId) {
          return <ChatBlockMyGroup chat={chat as LT.ChatTypeLocal} isSameArea={isSameArea} key={idx} />
        } // ::
        else {
          return <ChatBlockOtherGroup chat={chat as LT.ChatTypeLocal} isSameArea={isSameArea} key={idx} />
        }
      })}
    </div>
  )
}
