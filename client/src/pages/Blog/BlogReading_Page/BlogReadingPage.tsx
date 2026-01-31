import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {Helmet} from 'react-helmet-async'

import {CheckAuth} from '@guard'
import {useFileActions, useBlogSelector} from '@redux'

import {ReadingHeaderPart, ReadingContentPart, ReadingCommentsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './BlogReadingPage.scss'
import '@styles/MarkdownStyles.scss'

type BlogReadingPageProps = DivCommonProps & {reqAuth: number}

export const BlogReadingPage: FC<BlogReadingPageProps> = ({reqAuth, className, ...props}) => {
  const {setFileOId, resetFileOId} = useFileActions()
  const file = useBlogSelector(state => state.file.file)
  const fileOId = useBlogSelector(state => state.file.fileOId)

  const location = useLocation()

  /**
   * 초기화: fileOId from url
   *
   * - Context 에서 이걸하면 url 바뀔때마다 fileOId 바뀌면서 작업이 많아진다
   */
  useEffect(() => {
    const fileOId = location.pathname.split('/main/blog/')[1]
    if (fileOId) {
      setFileOId(fileOId)
    } // ::
    else {
      resetFileOId()
    }

    return () => {
      resetFileOId()
    }
  }, [location, resetFileOId, setFileOId])

  // 메타 태그용 description 생성 (content의 첫 150자)
  const getDescription = () => {
    if (!file?.content) return 'KYH Blog 포스트'
    const plainText = file.content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n/g, ' ')
      .trim()
    return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText
  }

  const title = file?.fileName ? `${file.fileName} - KYH Blog` : '블로그 포스트 - KYH Blog'
  const description = getDescription()
  const url = fileOId ? `${SV.CLIENT_URL}/main/blog/${fileOId}` : `${SV.CLIENT_URL}/main/blog`

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
      <div className={`BlogReadingPage ${className || ''}`} {...props}>
        <div className={`_container_page`}>
          <ReadingHeaderPart />
          <ReadingContentPart />
          <ReadingCommentsPart />
        </div>
      </div>
    </CheckAuth>
  )
}
