import {useCallback, useEffect, useEffectEvent, useState} from 'react'

import {useAuthStatesContext} from '@context'
import {useBlogDispatch, useBlogSelector, useTemplateActions} from '@redux'

import {OpenChatRoomListBtn} from './buttons'
import {ChatRoomPart, ChatRoomListPart, LogInPart, SignUpPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as T from '@type'

import './Righter.scss'

type RighterProps = DivCommonProps & {}

const DELAY_IS_OPEN = 400
const DELAY_CN_CHANGE = 10

export const Righter: FC<RighterProps> = ({...props}) => {
  const headerBtnClicked = useBlogSelector(state => state.template.headerBtnClicked)
  const chatRoomOId = useBlogSelector(state => state.chat.chatRoomOId)
  const {resetHeaderBtnClicked} = useTemplateActions()

  const {isLoggedIn} = useAuthStatesContext()

  const [cnChatRoom, setCnChatRoom] = useState<string>('_close')
  const [cnChatRoomList, setCnChatRoomList] = useState<string>('_close')
  const [cnLogIn, setCnLogIn] = useState<string>('_close')
  const [cnSignUp, setCnSignUp] = useState<string>('_close')

  const [isOpenChatRoom, setIsOpenChatRoom] = useState<boolean>(false)
  const [isOpenChatRoomList, setIsOpenChatRoomList] = useState<boolean>(false)
  const [isOpenLogIn, setIsOpenLogIn] = useState<boolean>(false)
  const [isOpenSignUp, setIsOpenSignUp] = useState<boolean>(false)

  const dispatch = useBlogDispatch()

  const closePart = useCallback(
    (whichPart: 'logIn' | 'signUp' | 'chatRoomList') => () => {
      const isLogIn = whichPart === 'logIn'
      const isSignUp = whichPart === 'signUp'
      const isChatRoomList = whichPart === 'chatRoomList'

      isLogIn && setCnLogIn('_close')
      isSignUp && setCnSignUp('_close')
      isChatRoomList && setCnChatRoomList('_close')

      new Promise(resolve => {
        setTimeout(() => {
          isLogIn && setIsOpenLogIn(false)
          isSignUp && setIsOpenSignUp(false)
          isChatRoomList && setIsOpenChatRoomList(false)
          dispatch(resetHeaderBtnClicked())
          resolve(true)
        }, DELAY_IS_OPEN)
      })
    },
    []
  )

  const openPart = useCallback((which: T.HeaderBtnClickedType | 'chatRoomList') => {
    const isLogIn = which === 'logIn'
    const isSignUp = which === 'signUp'
    const isChatRoomList = which === 'chatRoomList'

    // 열려고 하는 파트가 아니면 전부 닫아야 한다.
    !isLogIn && setCnLogIn('_close')
    !isSignUp && setCnSignUp('_close')
    !isChatRoomList && setCnChatRoomList('_close')

    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenLogIn(isLogIn)
        setIsOpenSignUp(isSignUp)
        setIsOpenChatRoomList(isChatRoomList)
        resolve(true)
      }, DELAY_IS_OPEN)
    }) // ::
      .then(() => {
        setTimeout(() => {
          isLogIn && setCnLogIn('_open')
          isSignUp && setCnSignUp('_open')
          isChatRoomList && setCnChatRoomList('_open')
          dispatch(resetHeaderBtnClicked())
        }, DELAY_CN_CHANGE)
      })
  }, [])

  const righterChangeEvent = useEffectEvent(async (headerBtnClicked: string) => {
    if (headerBtnClicked === 'logIn') {
      openPart('logIn')
    } // ::
    else if (headerBtnClicked === 'signUp') {
      openPart('signUp')
    } // ::
    /**
     * 이거 안 두는게 좋다
     * - 클릭된 버튼이 null 인건 아직 눌린 버튼이 없다는 뜻이다
     * - 눌린 버튼이 없으면 아무것도 하면 안된다
     */
    // else {
    //   setIsOpenLogIn(false)
    //   setIsOpenSignUp(false)
    //   setCnLogIn('_close')
    //   setCnSignUp('_close')
    // }
  })

  // 헤더 버튼 클릭 여부에 따라 로그인, 회원가입 파트 열기/닫기
  useEffect(() => {
    if (headerBtnClicked) {
      righterChangeEvent(headerBtnClicked)
    }
  }, [headerBtnClicked])

  // 초기화: 채팅방 열려있는지 여부
  useEffect(() => {
    /**
     * isLoggedIn 이 컴포넌트 리턴할때 중복 연산이 되기는 한다
     * 가독성을 위해 일부러 저렇게 두는편이 나을것 같다
     */
    if (chatRoomOId && isLoggedIn) {
      new Promise(resolve => {
        setTimeout(() => {
          setIsOpenChatRoom(true)
          resolve(true)
        }, DELAY_IS_OPEN)
      }) // ::
        .then(() => {
          setTimeout(() => {
            setCnChatRoom('_open')
          }, DELAY_CN_CHANGE)
        })
    } // ::
    else {
      setCnChatRoom('_close')

      new Promise(resolve => {
        setTimeout(() => {
          setIsOpenChatRoom(false)
          resolve(true)
        }, DELAY_IS_OPEN)
      })
    }
  }, [chatRoomOId, isLoggedIn])

  return (
    <div className={`Righter`} {...props}>
      {/* 1. 비로그인 상태: 로그인, 회원가입 파트 */}
      {!isLoggedIn && isOpenLogIn && <LogInPart className={cnLogIn} closePart={closePart('logIn')} />}
      {!isLoggedIn && isOpenSignUp && <SignUpPart className={cnSignUp} closePart={closePart('signUp')} />}

      {/* 2. 로그인 상태: 채팅방 목록 파트*/}
      {isLoggedIn && isOpenChatRoom && <ChatRoomPart className={cnChatRoom} isChatRoomListOpen={isOpenChatRoomList} />}
      {isLoggedIn && isOpenChatRoomList && <ChatRoomListPart className={cnChatRoomList} />}
      {isLoggedIn && <OpenChatRoomListBtn closePart={closePart('chatRoomList')} isOpen={isOpenChatRoomList} openPart={openPart} />}
    </div>
  )
}
