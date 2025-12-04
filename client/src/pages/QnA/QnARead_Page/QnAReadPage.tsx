import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {CheckAuth} from '@guard'
import {useQnAActions} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAReadPage.scss'
import {useQnACallbacksContext} from '@context'

type QnAReadPageProps = DivCommonProps & {
  reqAuth: number
}

export const QnAReadPage: FC<QnAReadPageProps> = ({reqAuth, ...props}) => {
  const {loadQnA} = useQnACallbacksContext()
  const {resetQnA} = useQnAActions()

  const location = useLocation()

  /**
   * 초기화: qnAOId from url
   */
  useEffect(() => {
    const qnAOId = location.pathname.split('/main/qna/read/')[1]
    if (qnAOId) {
      loadQnA(qnAOId)
    }

    return () => {
      resetQnA()
    }
  }, [location])

  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`QnAReadPage`} {...props}>
        <div>QnAReadPage</div>
      </div>
    </CheckAuth>
  )
}
