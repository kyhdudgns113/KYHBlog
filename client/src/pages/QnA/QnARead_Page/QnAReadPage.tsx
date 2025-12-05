import {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import {CheckAuth} from '@guard'
import {useQnAActions} from '@redux'

import {QnAHeaderPart, QnAContentPart, QnACommentPart} from './parts'

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
  const navigate = useNavigate()

  /**
   * 초기화: qnAOId from url
   */
  useEffect(() => {
    const qnAOId = location.pathname.split('/main/qna/read/')[1]
    if (qnAOId) {
      loadQnA(qnAOId) // ::
        .then(res => {
          const {isSuccess} = res
          if (!isSuccess) {
            alert(`권한이 없어요`)
            navigate('/main/qna')
          }
        })
    }

    return () => {
      resetQnA()
    }
  }, [location])

  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`QnAReadPage`} {...props}>
        <div className="_container_page">
          {/* 1. 헤더 영역 (제목, 작성자 정보, 수정 버튼) */}
          <QnAHeaderPart />

          {/* 2. 게시글 내용 영역 */}
          <QnAContentPart />

          {/* 3. 댓글 영역 */}
          <QnACommentPart />
        </div>
      </div>
    </CheckAuth>
  )
}
