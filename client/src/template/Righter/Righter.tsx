import {useCallback, useEffect, useEffectEvent, useState} from 'react'

import {useAuthStatesContext} from '@context'
import {useBlogDispatch, useBlogSelector, useTemplateActions} from '@redux'

import {LogInPart, SignUpPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as T from '@type'

import './Righter.scss'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({...props}) => {
  const headerBtnClicked = useBlogSelector(state => state.template.headerBtnClicked)
  const {resetHeaderBtnClicked} = useTemplateActions()

  const {isLoggedIn} = useAuthStatesContext()

  const [cnLogIn, setCnLogIn] = useState<string>('_close')
  const [cnSignUp, setCnSignUp] = useState<string>('_close')
  const [isOpenLogIn, setIsOpenLogIn] = useState<boolean>(false)
  const [isOpenSignUp, setIsOpenSignUp] = useState<boolean>(false)

  const dispatch = useBlogDispatch()

  const closePart = useCallback(() => {
    setCnLogIn('_close')
    setCnSignUp('_close')
    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenLogIn(false)
        setIsOpenSignUp(false)
        dispatch(resetHeaderBtnClicked())
        resolve(true)
      }, 400)
    })
  }, [])

  const openPart = useCallback((which: T.HeaderBtnClickedType) => {
    const isLogIn = which === 'logIn'
    const isSignUp = which === 'signUp'

    !isLogIn && setCnLogIn('_close')
    !isSignUp && setCnSignUp('_close')

    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenLogIn(isLogIn)
        setIsOpenSignUp(isSignUp)
        resolve(true)
      }, 400)
    }) // ::
      .then(() => {
        setTimeout(() => {
          isLogIn && setCnLogIn('_open')
          isSignUp && setCnSignUp('_open')
          dispatch(resetHeaderBtnClicked())
        }, 10)
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

  // 헤더 버큰 클릭 여부에 따라 로그인, 회원가입 파트 열기/닫기
  useEffect(() => {
    if (headerBtnClicked) {
      righterChangeEvent(headerBtnClicked)
    }
  }, [headerBtnClicked])

  return (
    <div className={`Righter`} {...props}>
      {!isLoggedIn && isOpenLogIn && <LogInPart className={cnLogIn} closePart={closePart} />}
      {!isLoggedIn && isOpenSignUp && <SignUpPart className={cnSignUp} closePart={closePart} />}
    </div>
  )
}
