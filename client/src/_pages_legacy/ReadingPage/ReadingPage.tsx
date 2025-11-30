import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {CheckAuth} from '@guard'
import {useFileActions} from '@redux'

import {ReadingHeaderPart, ReadingContentPart, ReadingCommentsPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_ReadingPage.scss'
import '@styles/MarkdownStyles.scss'

type ReadingPageProps = DivCommonProps & {reqAuth: number}

export const ReadingPage: FC<ReadingPageProps> = ({reqAuth, className, ...props}) => {
  const {setFileOId, resetFileOId} = useFileActions()

  const location = useLocation()

  /**
   * 초기화: fileOId from url
   *
   * - Context 에서 이걸하면 url 바뀔때마다 fileOId 바뀌면서 작업이 많아진다
   */
  useEffect(() => {
    const fileOId = location.pathname.split('/main/reading/')[1]
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
    <CheckAuth reqAuth={reqAuth}>
      <div className={`ReadingPage ${className || ''}`} {...props}>
        <div className={`_container_page`}>
          <ReadingHeaderPart />
          <ReadingContentPart />
          <ReadingCommentsPart />
        </div>
      </div>
    </CheckAuth>
  )
}
