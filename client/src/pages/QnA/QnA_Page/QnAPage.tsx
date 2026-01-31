import {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'

import {useQnACallbacksContext} from '@context'

import {QnAHeaderPart, QnATablePart, QnAPagingPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './QnAPage.scss'

type QnAPageProps = DivCommonProps & {}

export const QnAPage: FC<QnAPageProps> = ({...props}) => {
  const {loadQnARowArr} = useQnACallbacksContext()

  useEffect(() => {
    loadQnARowArr()
  }, [])

  return (
    <>
      <Helmet>
        <title>Q&A - KYH Blog</title>
        <meta name="description" content="KYH Blog Q&A 페이지 - 질문과 답변" />
        <link rel="canonical" href={`${SV.CLIENT_URL}/main/qna`} />

        <meta property="og:title" content="Q&A - KYH Blog" />
        <meta property="og:description" content="KYH Blog Q&A 페이지 - 질문과 답변" />
        <meta property="og:url" content={`${SV.CLIENT_URL}/main/qna`} />

        <meta property="twitter:title" content="Q&A - KYH Blog" />
        <meta property="twitter:description" content="KYH Blog Q&A 페이지 - 질문과 답변" />
      </Helmet>
      <div className={`QnAPage`} {...props}>
        <div className="_wrapper_page">
          <QnAHeaderPart />
          <QnATablePart />
          <QnAPagingPart />
        </div>
      </div>
    </>
  )
}
