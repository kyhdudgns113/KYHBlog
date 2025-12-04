import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {CheckAuth} from '@guard'
import {useQnAActions} from '@redux'

import {HeaderPart, QnAEditFormPart} from './parts'
import {useQnACallbacksContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAEditPage.scss'

type QnAEditPageProps = DivCommonProps & {
  reqAuth: number
}

export const QnAEditPage: FC<QnAEditPageProps> = ({reqAuth, ...props}) => {
  const {loadQnA} = useQnACallbacksContext()
  const {resetQnA} = useQnAActions()

  const location = useLocation()

  /**
   * 초기화: qnAOId from url
   */
  useEffect(() => {
    const qnAOId = location.pathname.split('/main/qna/edit/')[1]
    if (qnAOId) {
      loadQnA(qnAOId)
    }

    return () => {
      resetQnA()
    }
  }, [location])

  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`QnAEditPage`} {...props}>
        <div className="_container_page">
          {/* 1. 상단 헤더 */}
          <HeaderPart />

          {/* 2. 수정 폼 */}
          <QnAEditFormPart />
        </div>
      </div>
    </CheckAuth>
  )
}

