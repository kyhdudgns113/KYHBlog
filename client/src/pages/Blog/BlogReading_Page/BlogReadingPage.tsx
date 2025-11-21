import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {useFileActions} from '@redux'

import {ReadingHeaderPart, ReadingContentPart, ReadingCommentsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './BlogReadingPage.scss'
import '@styles/MarkdownStyles.scss'

type BlogReadingPageProps = DivCommonProps & {}

export const BlogReadingPage: FC<BlogReadingPageProps> = ({className, ...props}) => {
  const {setFileOId, resetFileOId} = useFileActions()

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

  return (
    <div className={`BlogReadingPage ${className || ''}`} {...props}>
      <div className="_container_page">
        <ReadingHeaderPart />
        <ReadingContentPart />
        <ReadingCommentsPart />
      </div>
    </div>
  )
}
