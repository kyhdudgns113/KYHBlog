import {useEffect, useEffectEvent, useState} from 'react'

import {useBlogDispatch, useBlogSelector, useTemplateActions} from '@redux'

import {LogInPart, SignUpPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Righter.scss'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({...props}) => {
  const headerBtnClicked = useBlogSelector(state => state.template.headerBtnClicked)
  const {resetHeaderBtnClicked} = useTemplateActions()

  const [cnLogIn, setCnLogIn] = useState<string>('_close')
  const [cnSignUp, setCnSignUp] = useState<string>('_close')
  const [isOpenLogIn, setIsOpenLogIn] = useState<boolean>(false)
  const [isOpenSignUp, setIsOpenSignUp] = useState<boolean>(false)

  const dispatch = useBlogDispatch()

  const righterChangeEvent = useEffectEvent(async (headerBtnClicked: string) => {
    if (headerBtnClicked === 'logIn') {
      setCnSignUp('_close')
      new Promise(resolve => {
        setTimeout(() => {
          setIsOpenSignUp(false)
          setIsOpenLogIn(true)
          resolve(true)
        }, 400)
      }) // ::
        .then(() => {
          setTimeout(() => {
            setCnLogIn('_open')
            dispatch(resetHeaderBtnClicked())
          }, 10)
        })
    } // ::
    else if (headerBtnClicked === 'signUp') {
      setCnLogIn('_close')
      new Promise<boolean>(resolve =>
        setTimeout(() => {
          setIsOpenLogIn(false)
          setIsOpenSignUp(true)
          resolve(true)
        }, 400)
      ) // ::
        .then(() => {
          setTimeout(() => {
            setCnSignUp('_open')
            dispatch(resetHeaderBtnClicked())
          }, 10)
        })
    } // ::
    else {
      setIsOpenLogIn(false)
      setIsOpenSignUp(false)
      setCnLogIn('_close')
      setCnSignUp('_close')
    }
  })

  // 헤더 버큰 클릭 여부에 따라 로그인, 회원가입 파트 열기/닫기
  useEffect(() => {
    if (headerBtnClicked) {
      righterChangeEvent(headerBtnClicked)
    }
  }, [headerBtnClicked])

  return (
    <div className={`Righter`} {...props}>
      {isOpenLogIn && <LogInPart className={cnLogIn} />}
      {isOpenSignUp && <SignUpPart className={cnSignUp} />}
    </div>
  )
}
