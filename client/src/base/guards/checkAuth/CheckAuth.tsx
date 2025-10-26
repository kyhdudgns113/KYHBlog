import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthCallbacksContext} from '@contexts/auth/_callbacks'
import {AUTH_USER} from '@secret'

import type {FC, PropsWithChildren} from 'react'

type CheckAuthProps = {
  reqAuth: number | null | undefined
}

export const CheckAuth: FC<PropsWithChildren<CheckAuthProps>> = ({children, reqAuth}) => {
  const {refreshToken} = useAuthCallbacksContext()

  const navigate = useNavigate()

  const errCallback = useCallback(() => {
    if (reqAuth === AUTH_USER) {
      alert('로그인이 필요합니다.')
    } // ::
    else {
      alert(`페이지 접근 권한이 부족합니다.`)
    }
    navigate('/')
  }, [reqAuth, navigate])

  refreshToken(reqAuth || 0, errCallback)

  return children
}
