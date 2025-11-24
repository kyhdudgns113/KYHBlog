import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './RedirectHomePage.scss'

type RedirectHomePageProps = DivCommonProps & {}

export const RedirectHomePage: FC<RedirectHomePageProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  // 1000ms 후에 /main/home 페이지로 이동
  useEffect(() => {
    setTimeout(() => {
      navigate('/main/home')
    }, 1000)
  }, [navigate])

  return (
    <div className={`RedirectHomePage ${className || ''}`} {...props}>
      <p className={`_title_page`}>잠시만 기다려주세요~~</p>
    </div>
  )
}
