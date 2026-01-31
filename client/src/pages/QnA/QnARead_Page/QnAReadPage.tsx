import {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Helmet} from 'react-helmet-async'

import {CheckAuth} from '@guard'
import {useQnAActions, useBlogSelector} from '@redux'

import {QnAHeaderPart, QnAContentPart, QnANewCommentPart, QnACommentListPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './QnAReadPage.scss'
import {useQnACallbacksContext} from '@context'

type QnAReadPageProps = DivCommonProps & {
  reqAuth: number
}

export const QnAReadPage: FC<QnAReadPageProps> = ({reqAuth, ...props}) => {
  const {loadQnA} = useQnACallbacksContext()
  const {resetQnA, resetQnACommentArr} = useQnAActions()
  const qnA = useBlogSelector(state => state.qna.qnA)

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
      resetQnACommentArr()
    }
  }, [location])

  // 메타 태그용 description 생성 (content의 첫 150자)
  const getDescription = () => {
    if (!qnA?.content) return 'KYH Blog Q&A 게시글'
    const plainText = qnA.content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n/g, ' ')
      .trim()
    return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText
  }

  const qnAOId = location.pathname.split('/main/qna/read/')[1]
  const title = qnA?.title ? `${qnA.title} - Q&A - KYH Blog` : 'Q&A 게시글 - KYH Blog'
  const description = getDescription()
  const url = qnAOId ? `${SV.CLIENT_URL}/main/qna/read/${qnAOId}` : `${SV.CLIENT_URL}/main/qna`

  return (
    <CheckAuth reqAuth={reqAuth}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />

        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:card" content="summary" />
      </Helmet>
      <div className={`QnAReadPage`} {...props}>
        <div className="_container_page">
          {/* 1. 헤더 영역 (제목, 작성자 정보, 수정 버튼) */}
          <QnAHeaderPart />

          {/* 2. 게시글 내용 영역 */}
          <QnAContentPart />

          {/* 3. 댓글 작성 영역 */}
          <QnANewCommentPart />

          {/* 4. 댓글 목록 영역 */}
          <QnACommentListPart />
        </div>
      </div>
    </CheckAuth>
  )
}
