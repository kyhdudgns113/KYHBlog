import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_RedirectMainPage.scss'

type RedirectMainPageProps = DivCommonProps & {}

export const RedirectMainPage: FC<RedirectMainPageProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  // 1000ms 후에 /main 페이지로 이동
  useEffect(() => {
    setTimeout(() => {
      navigate('/main')
    }, 1000)
  }, [navigate])

  return (
    <div className={`RedirectMainPage ${className || ''}`} {...props}>
      <p className="_title_page">잠시만 기다려주세요~~</p>
    </div>
  )
}
